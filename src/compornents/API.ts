/*
API実装ファイル
APIの定義に関してはbackend/app/routes.pyを参照すること
types.tsに定義されている型を使用すること
*/
import { Workplace, Bento, Reservation, User, Login, TimeFlag,Statistics, Exclude } from './types';
import axiosInstance from './axiosInstance';

interface InitialSetupResponse {
    initialSetupRequired: boolean;
}



export async function checkInitialSetup(updateInitialSetupState: (value: boolean) => void){
    try {
      const response = await axiosInstance.get<InitialSetupResponse>('/check_initial_setup');
      
      // Update the initial setup state based on API response
      updateInitialSetupState(Boolean(response.data.initialSetupRequired));
    } catch (error) {
      console.error('Failed to check initial setup:', error);
    }
}
export async function login(id: string, password: string): Promise<Login | null> {
    try {
        const response = await axiosInstance.post<Login>('/login', { id, password });
  
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
        const response = await axiosInstance.post<Login>('/setup', { id, password });
        
        // Assuming that the API returns the Login object in response.data
        return response.data;
    }
    catch (error) {
        console.error('administratorSetup request failed', error);
        return null;
    }
}

export async function getWorkplaces(): Promise<Workplace[]> {
    
    const response = await axiosInstance.get<Workplace[]>('/workplaces');
    return response.data;
}

export async function getWorkplace(id: number): Promise<Workplace> {
    const response = await axiosInstance.get<Workplace>(`/workplaces/${id}`);
    return response.data;
}

export async function addWorkplace(newWorkplace: Partial<Workplace>): Promise<Workplace> {
    const response = await axiosInstance.post<Workplace>('/workplaces', newWorkplace);
    return response.data;
}

export async function updateWorkplace(id: number, updatedWorkplace: Partial<Workplace>): Promise<Workplace> {
    const response = await axiosInstance.put<Workplace>(`/workplaces/${id}`, updatedWorkplace);
    return response.data;
}

export async function deleteWorkplace(id: number): Promise<void> {
    await axiosInstance.delete(`/workplaces/${id}`);
}


export async function getBentoByID(id: number): Promise<Bento> {
    const response = await axiosInstance.get<Bento>(`/bento/${id}`);
    return response.data;
}

export async function getBento(): Promise<Bento[]> {
    try{
        const response = await axiosInstance.get<Bento[]>('/bento');
        return response.data;
    }catch(error){
        console.error("Error in getBento:", error);
        return [];
    }
}

export async function getBentoByChooseFlag(): Promise<Bento|null> {
    try{
        const response = await axiosInstance.get<Bento>('/bento/choose');
        return response.data;
    }catch(error){
        console.error("Error in getBento:", error);
        return null ;
    }
}

export async function addBento(newBento: Partial<Bento>): Promise<Bento> {
    
        const response = await axiosInstance.post<Bento>('/bento', newBento);
        return response.data;
}

export async function updateBento(id: number, updatedBento: Partial<Bento>): Promise<Bento> {
    const response = await axiosInstance.put<Bento>(`/bento/${id}`, updatedBento);
    return response.data;
}

export async function deleteBento(id: number): Promise<void> {
    await axiosInstance.delete(`/bento/${id}`);
}


export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await axiosInstance.get('/users');
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return [];
    }
}

export const getUserById = async (userId: number): Promise<User> => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
        // Here, decide what to return in case of an error.
    }
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
}

export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
}

export async function changeUserPassword(userId: number, newPassword: string): Promise<User | null> {
    try {
        const response = await axiosInstance.put(`/users/${userId}`, { password: newPassword });
  
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
    await axiosInstance.delete(`/users/${userId}`);
}

export async function getReservationByID(user_id: string): Promise<Reservation[]> {
    const response = await axiosInstance.get<Reservation[]>(`/reservations/user/${user_id}`);
    return response.data;
}

export async function getReservations(): Promise<Reservation[]> {
    const response = await axiosInstance.get<Reservation[]>('/reservations');
    return response.data;
}


export async function addReservation(newReservation: Partial<Reservation>): Promise<Reservation> {
    const response = await axiosInstance.post<Reservation>('/reservations', newReservation);
    return response.data;
}

export async function updateReservation(id: number, updatedReservation: Partial<Reservation>): Promise<Reservation> {
    const response = await axiosInstance.put<Reservation>(`/reservations/${id}`, updatedReservation);
    return response.data;
}

export async function deleteReservation(id: number): Promise<void> {
    await axiosInstance.delete(`/reservations/${id}`);
}

export async function getExcludes(): Promise<Exclude[]> {
    const response = await axiosInstance.get<Exclude[]>('/exclude');
    return response.data;
}

export async function addExclude(newExclude: Partial<Exclude>): Promise<Exclude> {
    const response = await axiosInstance.post<Exclude>('/exclude', newExclude);
    return response.data;
}

export async function deleteExclude(id: number): Promise<void> {
    await axiosInstance.delete(`/exclude/${id}`);
}

export async function getTimeFlag(): Promise<TimeFlag> {
    const response = await axiosInstance.get<TimeFlag>('/timeflag');
    return response.data;
}

export async function getTimeFlagByID(id: number): Promise<TimeFlag> {
    const response = await axiosInstance.get<TimeFlag>(`/timeflag/${id}`);
    console.log(response.data);
    return response.data;
}
export async function updateTimeFlag(timeFlag: TimeFlag): Promise<TimeFlag> {
    console.log(timeFlag);
    const response = await axiosInstance.put<TimeFlag>(`/timeflag/${timeFlag.id}`, {
        time_flag: timeFlag.time_flag // ensure the data is sent as JSON
    });
    return response.data;
}

export async function getStatistics(year: number, month: number, page: number = 1, perPage: number = 10): Promise<Statistics> {
    const response = await axiosInstance.get<Statistics>(`/statistics/${year}/${month}?page=${page}&per_page=${perPage}`);
    return response.data;
}
