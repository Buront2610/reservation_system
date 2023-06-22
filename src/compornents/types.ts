/*型定義ファイル
  ここで型定義を行うことで、コンポーネント間のデータのやり取りを行う  
  UserとLoginは同じ型定義を使うため、後でどちらかを削除する
*/
export interface User {
    id: number;
    employee_number: string;
    password: string;
    role: string;
    name: string;
    email_address: string;
    telephone: string;
    hide_flag: boolean;
    workplace_id: number;
}

export interface Workplace {
    id: number;
    name: string;
    location: string;
}

export interface Bento{
    id: number;
    name: string;
    price: number;
    choose_flag: boolean;
}
export interface Reservation {
    id: number;
    user_id: string;
    bento_id: number;
    reservation_date: string;
    quantity: number;
    remarks: string;
}

export interface Login {
    id: string
    token: string;
    role: string;
}



export interface Exclude {
    id: number;
    exclude_date: string;
}

export interface TimeFlag {
    id: number;
    time_flag: boolean;
}

export interface Statistics {
    reservations: Reservation[];
    total: number;
    page: number;
    per_page: number;
    location_order_counts: Record<string, number>;
    location_order_amounts: Record<string, number>;
    employee_monthly_order_counts: Record<string, { name: string, count: number }>;
    employee_monthly_order_amounts: Record<string, { name: string, amount: number }>;
}