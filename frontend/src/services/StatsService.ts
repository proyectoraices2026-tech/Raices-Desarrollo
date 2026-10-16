import { supabase } from "../lib/supabase";

export type StatsRange = "week" | "month" | "year";

/* Una fila por día (semana y mes) o por mes (año), tal como la devuelve get_financial_summary */
export interface FinancialBucket {
    bucket: string;
    sales: number;
    cost_of_goods: number;
    investment: number;
    net_profit: number;
}

export interface FinancialTotals {
    sales: number;
    costOfGoods: number;
    investment: number;
    netProfit: number;
}

/* Resumen financiero del período actual. Solo responde si quien llama es admin (lo valida la función en la base de datos). */
export async function getFinancialSummary(range: StatsRange): Promise<FinancialBucket[]> {
    const { data, error } = await supabase.rpc("get_financial_summary", { p_range: range });

    if (error) throw error;

    return (data ?? []).map((row: Record<string, unknown>) => ({
        bucket: String(row.bucket),
        sales: Number(row.sales),
        cost_of_goods: Number(row.cost_of_goods),
        investment: Number(row.investment),
        net_profit: Number(row.net_profit),
    }));
}

/* Suma todas las filas del período para mostrar un solo número por concepto */
export function sumFinancialBuckets(buckets: FinancialBucket[]): FinancialTotals {
    return buckets.reduce<FinancialTotals>(
        (acc, b) => ({
            sales: acc.sales + b.sales,
            costOfGoods: acc.costOfGoods + b.cost_of_goods,
            investment: acc.investment + b.investment,
            netProfit: acc.netProfit + b.net_profit,
        }),
        { sales: 0, costOfGoods: 0, investment: 0, netProfit: 0 }
    );
}