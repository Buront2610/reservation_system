//型定義ファイル
export interface Workplace {
    id: number;
    name: string;
    location: string;
}

export interface Bento {
    id: number;
    name: string;
    price: number;
}

export interface Employee {
    id: number;
    name: string;
    workplace_id: number;
}

export interface Reservation {
    id: number;
    employee_id: number;
    reservation_date: string;
    bento_id: number;
    quantity: number;
    is_delivered: boolean;
}

export interface User {
    id: number;
    password: string;
    role: string;
}

export interface Login {
    id: number;
    password: string;
    role: string;
}
