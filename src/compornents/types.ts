/*型定義ファイル
  ここで型定義を行うことで、コンポーネント間のデータのやり取りを行う  
  UserとLoginは同じ型定義を使うため、後でどちらかを削除する
*/
export interface Workplace {
    id: number;
    name: string;
    location: string;
}

export interface Bento {
    id: number;
    name: string;
    price: number;
    choose_flag: boolean;
}

export interface Employee {
    id: number;
    name: string;
    workplace_id: number;
    mailaddress: string;
    telephone: string;
    hide_flag: boolean;

}

export interface Reservation {
    id: number;
    employee_id: number;
    reservation_date: string;
    bento_id: number;
    quantity: number;
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

export interface Exclude{
    id: number;
    Date: string;
}

export interface TimeFlag{
    id: number;
    TimeFlag: boolean;
}
