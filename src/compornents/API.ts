/*
API実装ファイル
APIの定義に関してはbackend/app/routes.pyを参照すること
types.tsに定義されている型を使用すること
*/
import axios from 'axios';
import { Workplace, Bento, Reservation, User, Login } from './types';
import { UseAuth } from './authContext';

const API_BASE_URL = 'http://localhost:5000/api';



export async function login(id: number, password: string): Promise<Login | null> {
    const users = await getUsers();
    const foundUser = users.find(user => user.id === id && user.password === password);
    if (!foundUser) {
        return null;
    }
    return {
        id: foundUser.id,
        password: foundUser.password,
        role: foundUser.role,
    };
}

export async function getWorkplaces(): Promise<Workplace[]> {
    
    const response = await axios.get<Workplace[]>(`${API_BASE_URL}/workplaces`);
    return response.data;
}

export async function getWorkplace(id: number): Promise<Workplace> {
    const response = await axios.get<Workplace>(`${API_BASE_URL}/workplaces/${id}`);
    return response.data;
}

export async function addWorkplace(newWorkplace: Partial<Workplace>): Promise<Workplace> {
    const response = await axios.post<Workplace>(`${API_BASE_URL}/workplaces`, newWorkplace);
    return response.data;
}

export async function updateWorkplace(id: number, updatedWorkplace: Partial<Workplace>): Promise<Workplace> {
    const response = await axios.put<Workplace>(`${API_BASE_URL}/workplaces/${id}`, updatedWorkplace);
    return response.data;
}

export async function deleteWorkplace(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/workplaces/${id}`);
}


export async function getBentoByID(id: number): Promise<Bento> {
    const response = await axios.get<Bento>(`${API_BASE_URL}/bento/${id}`);
    return response.data;
}

export async function getBento(): Promise<Bento[]> {
    const response = await axios.get<Bento[]>(`${API_BASE_URL}/bento`);
    return response.data;
}

export async function addBento(newBento: Partial<Bento>): Promise<Bento> {
    const response = await axios.post<Bento>(`${API_BASE_URL}/bento`, newBento);
    return response.data;
}

export async function updateBento(id: number, updatedBento: Partial<Bento>): Promise<Bento> {
    const response = await axios.put<Bento>(`${API_BASE_URL}/bento/${id}`, updatedBento);
    return response.data;
}

export async function deleteBento(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/bento/${id}`);
}

export async function getUser(id: number): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/User/${id}`);
    return response.data;
}
export async function getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
}

export async function addUser(newUser: Partial<User>): Promise<User> {
    const response = await axios.post<User>(`${API_BASE_URL}/User`, newUser);
    return response.data;
}

export async function updateUser(id: number, updatedUser: Partial<User>): Promise<User> {
    const response = await axios.put<User>(`${API_BASE_URL}/User/${id}`, updatedUser);
    return response.data;
}

export async function deleteUser(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/User/${id}`);
}

export async function getReservationByID(id: number): Promise<Reservation> {
    const response = await axios.get<Reservation>(`${API_BASE_URL}/reservations/${id}`);
    return response.data;
}

export async function getReservations(): Promise<Reservation[]> {
    const response = await axios.get<Reservation[]>(`${API_BASE_URL}/reservations`);
    return response.data;
}


export async function addReservation(newReservation: Partial<Reservation>): Promise<Reservation> {
    const response = await axios.post<Reservation>(`${API_BASE_URL}/reservations`, newReservation);
    return response.data;
}

export async function updateReservation(id: number, updatedReservation: Partial<Reservation>): Promise<Reservation> {
    const response = await axios.put<Reservation>(`${API_BASE_URL}/reservations/${id}`, updatedReservation);
    return response.data;
}

export async function deleteReservation(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/reservations/${id}`);
}

export async function getExcludes(): Promise<string[]> {
    const response = await axios.get<string[]>(`${API_BASE_URL}/excludes`);
    return response.data;
}

export async function addExclude(newExclude: Partial<string>): Promise<string> {
    const response = await axios.post<string>(`${API_BASE_URL}/excludes`, newExclude);
    return response.data;
}

export async function deleteExclude(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/excludes/${id}`);
}

//時間帯フラグの取得
export async function getTimeFlag(): Promise<boolean> {
    const response = await axios.get<boolean>(`${API_BASE_URL}/timeflag`);
    return response.data;
}

//時間帯フラグの更新
export async function updateTimeFlag(newTimeFlag: Partial<boolean>): Promise<boolean> {
    const response = await axios.post<boolean>(`${API_BASE_URL}/timeflag`, newTimeFlag);
    return response.data;
}

