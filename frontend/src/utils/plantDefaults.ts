// src/utils/plantDefaults.ts

import { hasPlantDefaults } from "../services/ProductService";
import type { PlantDefaults, Product } from "../services/ProductService";
import type { TaskUnit } from "../services/UserPlantsService";

export interface FrequencyState {
    enabled: boolean;
    interval: number | "";
    unit: TaskUnit;
}

/* Estado del formulario para la sección "Es una planta" de un producto */
export interface PlantDefaultsState {
    isPlant: boolean;
    scientificName: string;
    watering: FrequencyState;
    pruning: FrequencyState;
    fertilizing: FrequencyState;
}

const NO_PLANT_DEFAULTS: PlantDefaults = {
    default_scientific_name: null,
    default_watering_interval: null,
    default_watering_unit: null,
    default_pruning_interval: null,
    default_pruning_unit: null,
    default_fertilizer_interval: null,
    default_fertilizer_unit: null,
};

/* Estado inicial para un producto nuevo: no es planta, y los intervalos traen un valor
   sugerido para que marcar una tarea sea rápido */
export function emptyPlantDefaultsState(): PlantDefaultsState {
    return {
        isPlant: false,
        scientificName: "",
        watering: { enabled: false, interval: 3, unit: "day" },
        pruning: { enabled: false, interval: 2, unit: "month" },
        fertilizing: { enabled: false, interval: 1, unit: "month" },
    };
}

function frequencyFromProduct(
    interval: number | null | undefined,
    unit: TaskUnit | null | undefined,
    fallback: FrequencyState
): FrequencyState {
    return interval && unit ? { enabled: true, interval, unit } : fallback;
}

/* Precarga el formulario de edición con los datos de planta que el producto ya tiene */
export function plantDefaultsStateFromProduct(product: Product): PlantDefaultsState {
    const base = emptyPlantDefaultsState();
    return {
        isPlant: hasPlantDefaults(product),
        scientificName: product.default_scientific_name ?? "",
        watering: frequencyFromProduct(product.default_watering_interval, product.default_watering_unit, base.watering),
        pruning: frequencyFromProduct(product.default_pruning_interval, product.default_pruning_unit, base.pruning),
        fertilizing: frequencyFromProduct(product.default_fertilizer_interval, product.default_fertilizer_unit, base.fertilizing),
    };
}

/* Convierte el estado del formulario a las columnas de products. Si no es planta, manda todo
   en null, así al editar un producto se pueden borrar los datos de planta */
export function plantDefaultsToPayload(state: PlantDefaultsState): PlantDefaults {
    if (!state.isPlant) return NO_PLANT_DEFAULTS;

    const toFreq = (f: FrequencyState) =>
        f.enabled && f.interval !== "" && f.interval > 0
            ? { interval: f.interval, unit: f.unit }
            : { interval: null, unit: null };

    const watering = toFreq(state.watering);
    const pruning = toFreq(state.pruning);
    const fertilizing = toFreq(state.fertilizing);

    return {
        default_scientific_name: state.scientificName.trim() || null,
        default_watering_interval: watering.interval,
        default_watering_unit: watering.unit,
        default_pruning_interval: pruning.interval,
        default_pruning_unit: pruning.unit,
        default_fertilizer_interval: fertilizing.interval,
        default_fertilizer_unit: fertilizing.unit,
    };
}

/* Devuelve el mensaje de error, o null si todo está bien */
export function validatePlantDefaults(state: PlantDefaultsState): string | null {
    if (!state.isPlant) return null;

    const invalidInterval = [state.watering, state.pruning, state.fertilizing].some(
        (f) => f.enabled && !(typeof f.interval === "number" && Number.isInteger(f.interval) && f.interval > 0)
    );
    if (invalidInterval) {
        return "Completa el intervalo (número entero mayor a 0) de cada tarea de planta activada.";
    }

    const hasAnyData = Object.values(plantDefaultsToPayload(state)).some((v) => v !== null);
    if (!hasAnyData) {
        return 'Indica el nombre científico o alguna frecuencia de cuidado, o desmarca "Es una planta".';
    }

    return null;
}