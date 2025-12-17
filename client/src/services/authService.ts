import api from "./api";

export interface User {
    _id:string;
    name:string;
    email:string;
    token:string;    
}

export const registerUser = async (userData: any) =>{
    const response = await api.post<User>('/users/register', userData);
    
    if(response.data.token){
        localStorage.setItem('token', response.data.token);
    }
    
    return response.data; 
};

export const loginUser = async (userData: any) =>{
    const response = await api.post<User>('/users/login', userData);
    
    if(response.data.token){
        localStorage.setItem('token', response.data.token);
    }
    
    return response.data; 
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};