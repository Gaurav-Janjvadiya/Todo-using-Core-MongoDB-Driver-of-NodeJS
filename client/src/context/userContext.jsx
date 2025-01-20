import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const userContext = createContext({
  user: { isUser: false },
  login: () => {},
  logout: () => {},
});

export const useUserContext = () => {
  return useContext(userContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ isUser: false });
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      setUser({ isUser: true });
    }
  }, []);
  const login = (token) => {
    setUser({ isUser: true });
    Cookies.set("jwt", token.jwt, { httpOnly: true });
  };
  const logout = () => {
    console.log(user);
    setUser({ isUser: true });
    Cookies.remove("jwt", token.jwt);
  };
  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
