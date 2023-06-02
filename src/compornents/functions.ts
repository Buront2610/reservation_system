/*
各関数集約ファイル
ライブラリ的に使用してください
*/
export const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
    return (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;
};

export const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = ("00" + (date.getMonth() + 1)).slice(-2);
    const d = ("00" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
};

