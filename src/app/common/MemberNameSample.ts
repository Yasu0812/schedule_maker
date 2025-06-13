import { RandomUtil } from "./RandomUtil";

export class MemberNameSample {
    /**
     * メンバー名のサンプルデータ
     */

    public static readonly MEMBER_NAME_CHARAS: string[] = [
        "田", "山", "川", "木", "本", "中", "村", "林", "松",
        "佐", "井", "石", "高", "小", "大", "藤", "谷", "野",
        "橋", "岡", "島", "原", "田", "山", "佐", "鈴", "青",
        "黒", "白", "赤", "黄", "緑", "紫", "桃", "橙", "茶",
        "梅", "桜", "菊", "蓮", "葵", "萩", "桐",
    ];

    public static readonly MEMBER_NAME_LENGTH_RATE = [0.1, 0.8, 0.1];
    /**
     * メンバー名のサンプルデータをランダムに取得する
     * @returns ランダムなメンバー名
     */
    public static getRandomMemberName(): string {
        const charas = this.MEMBER_NAME_CHARAS;
        const lengthRate = this.MEMBER_NAME_LENGTH_RATE;
        const length = RandomUtil.weightedChoice([1, 2, 3], lengthRate);
        let memberName = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charas.length);
            memberName += charas[randomIndex];
        }
        return memberName;
    }
}