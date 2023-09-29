/*
API実装ファイル
APIの定義に関してはbackend/app/routes.pyを参照すること
types.tsに定義されている型を使用すること
*/
import axios from 'axios';
import { Workplace, Bento, Reservation, User, Login, TimeFlag,Statistics, Exclude } from './types';
import { useAuth } from './authContext';
import { th } from 'date-fns/locale';

//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'http://192.168.0.63:5000/api';




export async function checkInitialSetup(updateInitialSetupState: Function){
    try {
      const response = await axios.get(`${API_BASE_URL}/check_initial_setup`);
      
      // Update the initial setup state based on API response
      if (response.data.initialSetupRequired) {
        updateInitialSetupState(true); // Use the function from the AuthContext
        // Optionally, you can redirect to the admin setup page here.
      } else {
        updateInitialSetupState(false); // Use the function from the AuthContext
      }
    } catch (error) {
      console.error('Failed to check initial setup:', error);
    }
}
export async function login(id: string, password: string): Promise<Login | null> {
    try {
        console.log('Sending login request', id, password);
        const response = await axios.post(`${API_BASE_URL}/login`, { id, password });
  
        console.log('Received response', response);
  
        if (response.data && response.data.id && response.data.token && response.data.role) {
            return {
                id: response.data.id,
                token: response.data.token,
                role: response.data.role,
            };
        } else {
            console.error('Invalid response data', response.data);
            return null;
        }
    } catch (error) {
        console.error('Login request failed', error);
        return null;
    }
}
  

export async function administratorSetup(id: string, password: string): Promise<Login | null> {
    try {
        console.log('Sending administratorSetup request', id, password);
        const response = await axios.post(`${API_BASE_URL}/setup`, { id, password });
        
        // Assuming that the API returns the Login object in response.data
        return response.data;
    }
    catch (error) {
        console.error('administratorSetup request failed', error);
        return null;
    }
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
    try{
        const response = await axios.get<Bento[]>(`${API_BASE_URL}/bento`);
        return response.data;
    }catch(error){
        console.error("Error in getBento:", error);
        return [];
    }
}

export async function getBentoByChooseFlag(): Promise<Bento|null> {
    try{
        const response = await axios.get<Bento>(`${API_BASE_URL}/bento/choose`);
        return response.data;
    }catch(error){
        console.error("Error in getBento:", error);
        return null ;
    }
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


export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return [];
    }
}

export const getUserById = async (userId: number): Promise<User> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
        // Here, decide what to return in case of an error.
    }
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
}

export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
    return response.data;
}

export async function changeUserPassword(userId: string, newPassword: string): Promise<User | null> {
    try {
        console.log('Sending change password request', userId, newPassword);
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, { password: newPassword });
  
        console.log('Received response', response);
  
        if (response.data) {
            return response.data;
        } else {
            console.error('Invalid response data', response.data);
            return null;
        }
    } catch (error) {
        console.error('Change password request failed', error);
        return null;
    }
}

export const deleteUser = async (userId: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${userId}`);
}

export async function getReservationByID(user_id: string): Promise<Reservation[]> {
    const response = await axios.get<Reservation[]>(`${API_BASE_URL}/reservations/user/${user_id}`);
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

export async function getExcludes(): Promise<Exclude[]> {
    const response = await axios.get<Exclude[]>(`${API_BASE_URL}/exclude`);
    return response.data;
}

export async function addExclude(newExclude: Partial<Exclude>): Promise<Exclude> {
    const response = await axios.post<Exclude>(`${API_BASE_URL}/exclude`, newExclude);
    return response.data;
}

export async function deleteExclude(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/exclude/${id}`);
}

export async function getTimeFlag(): Promise<TimeFlag> {
    const response = await axios.get<TimeFlag>(`${API_BASE_URL}/timeflag`);
    return response.data;
}

export async function getTimeFlagByID(id: number): Promise<TimeFlag> {
    const response = await axios.get<TimeFlag>(`${API_BASE_URL}/timeflag/${id}`);
    console.log(response.data);
    return response.data;
}
export async function updateTimeFlag(timeFlag: TimeFlag): Promise<TimeFlag> {
    console.log(timeFlag);
    const response = await axios.put<TimeFlag>(`${API_BASE_URL}/timeflag/${timeFlag.id}`, {
        time_flag: timeFlag.time_flag // ensure the data is sent as JSON
    });
    return response.data;
}

export async function getStatistics(year: number, month: number, page: number = 1, perPage: number = 10): Promise<Statistics> {
    const response = await axios.get<Statistics>(`${API_BASE_URL}/statistics/${year}/${month}?page=${page}&per_page=${perPage}`);
    return response.data;
}
