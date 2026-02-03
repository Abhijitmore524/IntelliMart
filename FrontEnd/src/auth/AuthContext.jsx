import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Pull individual keys to rebuild the user state on page refresh
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      setUser({ token, role, id: userId });
    }
  }, []);

  const login = (resData) => {
    // resData comes from SigninResponse: { token, message, role, userId }
    localStorage.setItem("token", resData.token);
    localStorage.setItem("role", resData.role);
    localStorage.setItem("userId", resData.userId); // Persistence for ID
    
    setUser({ 
      token: resData.token, 
      role: resData.role, 
      id: resData.userId 
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);