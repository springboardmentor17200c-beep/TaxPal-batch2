import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = { id: 1, name: "Test User", email };
      const mockToken = "token-" + Date.now();

      setUser(mockUser);
      setToken(mockToken);

      return { success: true };
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = { id: 1, name, email };
      const mockToken = "token-" + Date.now();

      setUser(mockUser);
      setToken(mockToken);

      return { success: true };
    } catch (error) {
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
