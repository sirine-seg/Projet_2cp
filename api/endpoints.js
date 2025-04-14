import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/authentification/'

const LOGIN_URL = ${BASE_URL}login/
//const REGISTER_URL = ${BASE_URL}regisiter/
//const LOGOUT_URL = ${BASE_URL}logout/
//const NOTES_URL = ${BASE_URL}todos/
//const AUTHENTICATED_URL = ${BASE_URL}authenticated/

axios.defaults.withCredentials = true; 

export const login = async (email, password) => {
    try {
        const response = await axios.post(
            LOGIN_URL, 
            { email, password },  // Object shorthand for cleaner syntax
            { withCredentials: true }  // Ensures cookies are included
        );
        
        // Check if the response contains a success attribute (depends on backend response structure)
        return response.data
    } catch (error) {
        console.error("Login failed:", error);
        return false;  // Return false or handle the error as needed
    }
};