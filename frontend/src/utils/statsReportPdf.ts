import { endOfWeek, format, isValid, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { sumFinancialBuckets } from "../services/StatsService";
import type { FinancialBucket, StatsRange } from "../services/StatsService";
import { formatPrice } from "./formatPrice";

export interface StatsReportSeller {
    name: string;
    value: number;
}

export interface StatsReportInput {
    range: StatsRange;
    buckets: FinancialBucket[];
    sellers: StatsReportSeller[];
    generatedAt?: Date;
}

const RANGE_TITLES: Record<StatsRange, string> = {
    week: "Resumen semanal",
    month: "Resumen mensual",
    year: "Resumen anual",
};

const RANGE_FILE_NAMES: Record<StatsRange, string> = {
    week: "semanal",
    month: "mensual",
    year: "anual",
};

type Rgb = [number, number, number];

const COLORS: Record<"dark" | "primary" | "light" | "card" | "gray", Rgb> = {
    dark: [30, 45, 36],
    primary: [83, 122, 99],
    light: [212, 230, 204],
    card: [239, 244, 237],
    gray: [100, 82, 68],
};

const MARGIN = 14;

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const money = (value: number) =>
    `${value < 0 ? "-" : ""}CRC ${formatPrice(Math.round(Math.abs(value)))}`;

function getPeriodLabel(range: StatsRange, now: Date): string {
    if (range === "week") {
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`;
    }
    if (range === "month") return capitalize(format(now, "MMMM yyyy", { locale: es }));
    return format(now, "yyyy");
}

function getBucketLabel(range: StatsRange, bucket: string): string {
    const date = parseISO(bucket);
    if (!isValid(date)) return bucket;
    return capitalize(format(date, range === "year" ? "MMMM" : "d MMM", { locale: es }));
}

function getLastY(doc: jsPDF): number {
    const last = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    return last?.finalY ?? 0;
}

function addPageFooter(doc: jsPDF, generatedAt: Date) {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.gray);
        doc.text("Raíces — Reporte de estadísticas", MARGIN, pageHeight - 8);
        doc.text(
            format(generatedAt, "d MMM yyyy, HH:mm", { locale: es }),
            pageWidth - MARGIN,
            pageHeight - 8,
            { align: "right" },
        );
        doc.text(`Página ${page} de ${pageCount}`, pageWidth / 2, pageHeight - 8, {
            align: "center",
        });
    }
}

export function downloadStatsReportPdf({
    range,
    buckets,
    sellers,
    generatedAt = new Date(),
}: StatsReportInput) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const totals = sumFinancialBuckets(buckets);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.dark);
    doc.text("Raíces", MARGIN, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.gray);
    doc.text("Reporte de estadísticas", MARGIN, 27);

    doc.setFontSize(9);
    doc.text(
        `Generado el ${format(generatedAt, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}`,
        pageWidth - MARGIN,
        20,
        { align: "right" },
    );

    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, 33, pageWidth - MARGIN, 33);

    let y = 42;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.dark);
    doc.text(RANGE_TITLES[range], MARGIN, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(getPeriodLabel(range, generatedAt), MARGIN, y);

    y += 7;

    autoTable(doc, {
        startY: y,
        theme: "grid",
        body: [
            ["Inversión", money(totals.investment)],
            ["Ventas", money(totals.sales)],
            ["Costo de lo vendido", money(totals.costOfGoods)],
            ["Beneficio neto", money(totals.netProfit)],
        ],
        styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 2.5,
            textColor: COLORS.dark,
            lineColor: COLORS.light,
            lineWidth: 0.2,
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 70 },
            1: { halign: "right", fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: COLORS.card },
    });

    y = getLastY(doc) + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.dark);
    doc.text("Ganancias del período", MARGIN, y);
    y += 4;

    if (buckets.length === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.gray);
        doc.text("Sin datos para este período.", MARGIN, y + 4);
        y += 12;
    } else {
        autoTable(doc, {
            startY: y,
            theme: "striped",
            head: [["Período", "Ventas", "Costo de lo vendido", "Inversión", "Beneficio neto"]],
            body: buckets.map((bucket) => [
                getBucketLabel(range, bucket.bucket),
                money(bucket.sales),
                money(bucket.cost_of_goods),
                money(bucket.investment),
                money(bucket.net_profit),
            ]),
            styles: { font: "helvetica", fontSize: 8, cellPadding: 2, textColor: COLORS.dark },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: COLORS.card },
            columnStyles: {
                0: { cellWidth: 34 },
                1: { halign: "right" },
                2: { halign: "right" },
                3: { halign: "right" },
                4: { halign: "right", fontStyle: "bold" },
            },
        });
        y = getLastY(doc) + 10;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.dark);
    doc.text("Más vendidos", MARGIN, y);
    y += 4;

    if (sellers.length === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.gray);
        doc.text("Sin ventas aceptadas en este período.", MARGIN, y + 4);
    } else {
        autoTable(doc, {
            startY: y,
            theme: "striped",
            head: [["#", "Producto", "Unidades"]],
            body: sellers.map((seller, index) => [
                String(index + 1),
                seller.name,
                `${seller.value} u.`,
            ]),
            styles: { font: "helvetica", fontSize: 8, cellPadding: 2, textColor: COLORS.dark },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: COLORS.card },
            columnStyles: {
                0: { cellWidth: 10, halign: "center" },
                1: { cellWidth: 120 },
                2: { halign: "right", fontStyle: "bold" },
            },
        });
    }

    addPageFooter(doc, generatedAt);
    doc.save(`reporte-${RANGE_FILE_NAMES[range]}-${format(generatedAt, "yyyy-MM-dd")}.pdf`);
}
