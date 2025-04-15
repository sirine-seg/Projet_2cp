import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { authenticated_user, login, register } from '../api/endpoints';


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    
    const get_authenticated_user = async () => {
      try {
        const user = await authenticated_user();
        console.log("Authenticated user:", user);
        setUser(user);
        return user;    // Add this line to return the user
        console.log("Authenticated user:", user);
      } catch (error) {
        // This is expected for non-logged in users - don't show an alert
        console.log ("salem") ; 
        console.log("User not authenticated yet");
        setUser(null);
      } finally {
        setLoading(false);
      }
  };

  const loginUser = async (email, password) => {
    try {
      console.log("Logging in with email:", email);
      // Step 1: Authenticate and get tokens
      const authResponse = await login(email, password);
      console.log("Authentication response:", authResponse);
      
      if (!authResponse) {
        alert('Incorrect username or password');
        return;
      }
      
      // Step 2: Now that we have tokens stored in localStorage,
      // we can fetch the user profile which includes role information
      try {
        const userProfile = await get_authenticated_user();
        console.log("User profile fetched:", userProfile);
        
        // Get role from user profile
        const userRole = userProfile.role || userProfile.user_role;
        console.log("User role:", userRole);
        
        // Navigate based on role
        if (userRole === 'Administrateur') {
          nav('/equipementsPage');
        } else {
          nav('/dashboard'); // Default fallback
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        nav('/dashboard'); // Default navigation on error
      }
      
    } catch (error) {
      console.error("Login error:", error);
      alert('Login failed');
    }
}

    const registerUser = async (first_name, last_name, numero_tel, email, password, confirm_password) => {
      try {
        if (password === confirm_password) {
          // Order matters! Make sure it matches the order in endpoints.js
          await register(email, first_name, last_name, password, numero_tel)
          alert('User successfully registered')
          nav('/login')
        } else {
          alert('Passwords do not match')
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert('Error registering user')
      }
    }

    // // Add logout function (but comment out if endpoint is not ready)
    // const logoutUser = () => {
    //   setUser(null);
    //   nav('/login');
    // }

    useEffect(() => {
        get_authenticated_user();
    }, [])

    // Add loading fallback
    if (loading) {
      return <div>Loading...</div>;
    }

    return ( 
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser }}>
          {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);