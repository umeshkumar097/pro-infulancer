// UserContext.js

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    age: '',
    experience: '',
    industry: '',
    email: '',
    phone: ''
  });

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext); // Custom hook to use UserContext

export { UserProvider, useUserContext }; // Exporting UserProvider and custom hook
export default UserContext; // Exporting UserContext itself as default
