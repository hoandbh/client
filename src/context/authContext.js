import axios from "axios";
import HomePage from '../pages/HomePage';

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const login = async ({ email, password }) => {
    const res = await axios.post(
      "http://localhost:3600/api/auth/login",
      {
        email, password
      },
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data.user);
    setToken(res.data.accessToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // if(!currentUser) //laly - how to navigate?
  //   return (
  //     <HomePage login={login}/>
  //   )  

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>

  )
};
