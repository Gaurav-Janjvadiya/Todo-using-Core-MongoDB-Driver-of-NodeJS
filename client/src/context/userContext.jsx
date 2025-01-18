import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const userContext = createContext({ isUser: false });

export const useUserContext = () => {
  return useContext(userContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ isUser: false });
  const login = (token) => {
    setUser({ isUser: true });
    Cookies.set("jwt", token);
  };
  const logout = () => {
    setUser({ isUser: true });
    Cookies.remove("jwt");
  };
  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
