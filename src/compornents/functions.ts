/*
各関数集約ファイル
ライブラリ的に使用
各コンポーネントから分離できた関数もここに集約できればする
*/

// 月の日数を取得
export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// 月の最初の曜日を取得
export const getFirstDayOfMonth = (date: Date): number => {
    return (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;
};

export const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = ("00" + (date.getMonth() + 1)).slice(-2);
    const d = ("00" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
};

