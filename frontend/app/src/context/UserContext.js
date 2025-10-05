import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me'); // backend endpoint to get current user
        setUser(res.data.user);
        console.log(res)
      } catch (err) {
        setUser(null);
      }finally {
      setLoading(false); // <-- IMPORTANT
    }
    };
    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
