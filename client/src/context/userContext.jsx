import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const userContext = createContext({
  user: { isUser: false, refreshToken: "" },
  login: () => {},
  logout: () => {},
});

export const useUserContext = () => {
  return useContext(userContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({ isUser: false, refreshToken: "" });
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      setUser({ isUser: true });
    }
  }, []);

  const login = (data) => {
    setUser({ isUser: true, refreshToken: data.refreshToken });
    // Cookies.set("jwt", data.accessToken, { expires: 15 / (24 * 60) });
  };

  const logout = () => {
    setUser({ isUser: false, refreshToken: "" });
    // Cookies.remove("jwt");
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
