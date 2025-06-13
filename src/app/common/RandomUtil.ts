
export class RandomUtil {
    /**
     * 指定された範囲内のランダムな整数を生成する
     * @param min 最小値（含む）
     * @param max 最大値（含む）
     * @returns ランダムな整数
     */
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 指定された配列からランダムな要素を取得する
     * @param array 対象の配列
     * @returns ランダムな要素
     */
    public static choice<T>(array: T[]): T {
        if (array.length === 0) {
            throw new Error("Array cannot be empty");
        }
        const randomIndex = this.getRandomInt(0, array.length - 1);
        return array[randomIndex];
    }
    /**
     * 指定された配列からランダムな要素を複数取得する
     * @param array 対象の配列
     * @param count 取得する要素の数
     * @returns ランダムな要素の配列
     */
    public static choices<T>(array: T[], count: number): T[] {
        if (count < 0 || count > array.length) {
            throw new Error("Count must be between 0 and the length of the array");
        }
        const shuffled = array.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    /**
     * 指定された配列からランダムな要素を重複なしで取得する
     * @param array 対象の配列
     * @returns ランダムな要素の配列
     */
    public static uniqueChoice<T>(array: T[], count: number): T[] {
        if (count < 0 || count > array.length) {
            throw new Error("Count must be between 0 and the length of the array");
        }
        const shuffled = array.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    /**
     * 指定された配列から、指定された確率リストに基づいて
     * ランダムな要素を取得する
     * @param array 対象の配列
     * @param probabilities 各要素の選択確率
     * @returns ランダムな要素
     */
    public static weightedChoice<T>(array: T[], probabilities: number[]): T {
        if (array.length !== probabilities.length) {
            throw new Error("Array and probabilities must have the same length");
        }
        const total = probabilities.reduce((sum, prob) => sum + prob, 0);
        const randomValue = Math.random() * total;
        let cumulativeProbability = 0;
        for (let i = 0; i < array.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomValue < cumulativeProbability) {
                return array[i];
            }
        }
        throw new Error("Should not reach here");
    }
}