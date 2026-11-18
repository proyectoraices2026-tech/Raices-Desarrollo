/* Reduce y convierte a WebP una imagen antes de subirla al bucket.
   Si algo falla o el resultado pesa más que el original, devuelve el archivo original. */
export async function compressImage(
    file: File,
    maxSize = 1000,
    quality = 0.8,
): Promise<File> {
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return file;
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/webp", quality),
        );
        if (!blob || blob.size >= file.size) return file;

        const baseName = file.name.replace(/\.[^.]+$/, "");
        return new File([blob], `${baseName}.webp`, { type: "image/webp" });
    } catch {
        return file;
    }
}