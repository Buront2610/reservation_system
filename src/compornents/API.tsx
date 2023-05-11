import axios from 'axios';
import { Workplace, Bento, Employee, Reservation, User, Login } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

//以下にAPIを実装する

export async function login(): Promise<Login[]> {
    const response = await axios.get<Login[]>(`${API_BASE_URL}/login`);
    return response.data;
}

export async function getWorkplaces(): Promise<Workplace[]> {
    const response = await axios.get<Workplace[]>(`${API_BASE_URL}/workplaces`);
    return response.data;
}

export async function getBento(): Promise<Bento[]> {
    const response = await axios.get<Bento[]>(`${API_BASE_URL}/bento`);
    return response.data;
}

export async function getUser(id: number): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/User/${id}`);
    return response.data;
}
export async function getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
    return response.data;
}

export async function getEmployees(): Promise<Employee[]> {
    const response = await axios.get<Employee[]>(`${API_BASE_URL}/employees`);
    return response.data;
}

export async function addUser(newUser: Partial<User>): Promise<User> {
    const response = await axios.post<User>(`${API_BASE_URL}/User`, newUser);
    return response.data;
}

export async function addEmployee(newEmployee: Partial<Employee>): Promise<Employee> {
    const response = await axios.post<Employee>(`${API_BASE_URL}/employees`, newEmployee);
    return response.data;
}

export async function updateEmployee(id: number, updatedEmployee: Partial<Employee>): Promise<Employee> {
    const response = await axios.put<Employee>(`${API_BASE_URL}/employees/${id}`, updatedEmployee);
    return response.data;
}

export async function deleteUser(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/User/${id}`);
}

export async function deleteEmployee(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/employees/${id}`);
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
