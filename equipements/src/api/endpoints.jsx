import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/authentification/'

const LOGIN_URL = `${BASE_URL}login/`
const REGISTER_URL = `${BASE_URL}register/`
//const LOGOUT_URL = ${BASE_URL}logout/
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`

axios.defaults.withCredentials = true; 

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { email, password },  // Object shorthand for cleaner syntax
            { withCredentials: true }  // Ensures cookies are included
        );

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
        }
        if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        
        // Check if the response contains a success attribute (depends on backend response structure)
        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;  // Return false or handle the error as needed
    }
};


export const register = async (email, first_name, last_name, password, numero_tel) => {
    const response = await axios.post(
        REGISTER_URL, 
        { email, first_name, last_name, password, numero_tel }, // is the order important 
        { withCredentials: true }
    );
    return response.data;
};




export const authenticated_user = async () => {
    console.log("Fetching authenticated user...");
    try {
        // Get token from localStorage
        const token = localStorage.getItem('access_token');
        console.log("Token from localStorage:", token);
        
        if (!token) {
            throw new Error("No authentication token found");
        }
        
        const response = await axios.get(AUTHENTICATED_URL, { 
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        });
        
        console.log("Authentication successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}
