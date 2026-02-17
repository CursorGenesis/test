/**
 * Compresses an image file to a specified maximum size and dimension.
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - Maximum width of the output image (default 1200px).
 * @param {number} quality - Initial quality (0 to 1).
 * @returns {Promise<string>} - A promise that resolves to the base64 string of the compressed image.
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compression loop to get below 150KB if possible
                let currentQuality = quality;
                let base64 = canvas.toDataURL('image/jpeg', currentQuality);

                // Simple check: if base64 length is roughly > 200KB (~150KB binary), reduce quality
                // Base64 size ~= Binary size * 1.33 
                // 200KB/1.33 = 150KB
                const MAX_SIZE_BYTES = 200 * 1024;

                while (base64.length > MAX_SIZE_BYTES && currentQuality > 0.3) {
                    currentQuality -= 0.1;
                    base64 = canvas.toDataURL('image/jpeg', currentQuality);
                }

                resolve(base64);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
