import type { Product } from "../services/ProductService";
import { formatPrice } from "./formatPrice";

/* Máximo de productos por imagen: 3 columnas x 3 filas (cabe en formato 4:5 de Instagram) */
export const MAX_SHARE_ITEMS = 9;

const WIDTH = 1080;
const COLUMNS = 3;
const PADDING = 48;
const GAP = 24;
const HEADER_HEIGHT = 190;
const FOOTER_HEIGHT = 90;
const CARD_HEIGHT = 340;
const IMAGE_HEIGHT = 220;

const COLOR_BG = "#f4f8f1";
const COLOR_GREEN_DARK = "#2D4A3E";
const COLOR_GREEN = "#4E705B";
const COLOR_WINE = "#722F37";
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/* Carga una imagen con CORS habilitado; si falla devuelve null para dibujar un recuadro vacío */
function loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        /* El parámetro evita que el navegador reutilice la copia en caché cargada sin CORS,
           que dejaría el canvas bloqueado al exportarlo */
        img.src = url + (url.includes("?") ? "&" : "?") + "share=1";
    });
}

/* Recorta el texto con "…" si no cabe en el ancho indicado */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let result = text;
    while (result.length > 1 && ctx.measureText(result + "…").width > maxWidth) {
        result = result.slice(0, -1);
    }
    return result.trimEnd() + "…";
}

/* Dibuja la cuadrícula de favoritos y la devuelve como PNG */
export async function buildFavoritesImage(products: Product[]): Promise<Blob> {
    const items = products.slice(0, MAX_SHARE_ITEMS);
    const rows = Math.ceil(items.length / COLUMNS);
    const cardWidth = (WIDTH - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
    const height = HEADER_HEIGHT + rows * CARD_HEIGHT + (rows - 1) * GAP + FOOTER_HEIGHT;

    const images = await Promise.all(
        items.map((p) => (p.image_url ? loadImage(p.image_url) : Promise.resolve(null)))
    );

    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No se pudo crear la imagen");

    /* Fondo */
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, WIDTH, height);

    /* Encabezado */
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = COLOR_GREEN_DARK;
    ctx.font = `800 60px ${FONT}`;
    ctx.fillText("Productos que deseo tener", PADDING, 100);
    ctx.fillStyle = COLOR_WINE;
    ctx.font = `600 30px ${FONT}`;
    ctx.fillText("Mi lista de favoritos en Raíces", PADDING, 160);

    /* Tarjetas */
    items.forEach((product, i) => {
        const col = i % COLUMNS;
        const row = Math.floor(i / COLUMNS);
        const x = PADDING + col * (cardWidth + GAP);
        const y = HEADER_HEIGHT + row * (CARD_HEIGHT + GAP);

        /* Fondo de la tarjeta */
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(x, y, cardWidth, CARD_HEIGHT, 24);
        ctx.fill();

        /* Imagen del producto, ajustada sin deformarse (equivale a object-contain) */
        const img = images[i];
        if (img) {
            const boxW = cardWidth - 24;
            const boxH = IMAGE_HEIGHT - 12;
            const scale = Math.min(boxW / img.width, boxH / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, x + (cardWidth - w) / 2, y + 12 + (boxH - h) / 2, w, h);
        }

        /* Nombre y precio */
        const textWidth = cardWidth - 40;
        ctx.fillStyle = "#1F2937";
        ctx.font = `700 28px ${FONT}`;
        ctx.fillText(fitText(ctx, product.name, textWidth), x + 20, y + IMAGE_HEIGHT + 50);
        ctx.fillStyle = COLOR_GREEN;
        ctx.font = `800 30px ${FONT}`;
        ctx.fillText(`₡${formatPrice(product.price)}`, x + 20, y + IMAGE_HEIGHT + 95);
    });

    /* Pie con la dirección del sitio */
    ctx.fillStyle = COLOR_GREEN_DARK;
    ctx.font = `600 28px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(window.location.host, WIDTH / 2, height - 35);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo exportar la imagen"))),
            "image/png"
        );
    });
}

/* Comparte la imagen con el menú nativo (móvil) o la descarga si el navegador no lo permite */
export async function shareFavorites(products: Product[]): Promise<"shared" | "downloaded" | "cancelled"> {
    const blob = await buildFavoritesImage(products);
    const file = new File([blob], "mis-favoritos-raices.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: "Mis favoritos en Raíces" });
            return "shared";
        } catch (err) {
            /* El usuario cerró el menú de compartir: no es un error */
            if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
            /* Cualquier otro fallo (p. ej. el navegador exige un clic más reciente): se descarga la imagen */
        }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mis-favoritos-raices.png";
    link.click();
    URL.revokeObjectURL(url);
    return "downloaded";
}