import React, { useState, useEffect } from 'react';
import axios from 'axios';
export const userContext = React.createContext();

export function UserProvider({ children }) {
  const [user, setuser] = useState({});

  useEffect(() => {
    axios
      .get('/api/auth/user')
      .then((e) => setuser(e.data))
      .catch((e) => console.log(e));
    console.log('called');
    console.log(user);
  }, []);
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
}
