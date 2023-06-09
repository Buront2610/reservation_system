/*型定義ファイル
  ここで型定義を行うことで、コンポーネント間のデータのやり取りを行う  
  UserとLoginは同じ型定義を使うため、後でどちらかを削除する
*/
export interface User {
    id: number;
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
    user_id: number;
    bento_id: number;
    reservation_date: string;
    quantity: number;
    remarks: string;
}

export interface Login {
    id: number;
    password: string;
    role: string;
}

export interface Exclude {
    id: number;
    date: string;
}

export interface TimeFlag {
    id: number;
    time_flag: boolean;
}