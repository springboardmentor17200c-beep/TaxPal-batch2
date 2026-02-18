import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  // Restore user if token exists
  useEffect(() => {
    const restoreUser = async () => {
      if (token && !user) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          logout();
        }
      }
    };

    restoreUser();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await authService.register(
        email,
        password,
        name
      );

      localStorage.setItem("token", response.token);
      setToken(response.token);
      setUser(response.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Signup failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
