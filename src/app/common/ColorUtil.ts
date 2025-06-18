
export class ColorUtil {
    /**
     * 明るい色から、自然な陰影用の色（濃い色）をHSLベースで生成
     * @param {string} hex - 開始の明るい色 (例: "#FF8A80")
     * @param {number} lightnessFactor - 明度をどれだけ下げるか（0〜1）、例: 0.7 = 70%の明度にする
     * @returns {{start: string, end: string}} - 開始色と終了色（どちらもHEX）
     */
    public static generateShadedGradientHSL(hex: string, lightnessFactor = 0.7) {
        // HEX → RGB
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0;

        // 明度
        const l = (max + min) / 2;

        // 彩度
        if (max === min) {
            h = s = 0; // 無彩色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h = h / 6;
        }

        // 明度だけ変更して暗い色を作る
        const darkL = Math.max(0, Math.min(1, l * lightnessFactor));

        // HSL → RGB
        function hslToRgb(h: number, s: number, l: number) {
            let r, g, b;

            if (s === 0) {
                r = g = b = l; // 無彩色
            } else {
                const hue2rgb = (p: number, q: number, t: number) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255),
            ];
        }

        const [r2, g2, b2] = hslToRgb(h, s, darkL);
        const toHex = (c: number) => c.toString(16).padStart(2, "0");

        return {
            start: hex,
            end: `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`
        };
    }
}