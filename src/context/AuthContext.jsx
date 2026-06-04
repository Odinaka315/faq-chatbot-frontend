import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Your Axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // If a token exists, fetch the user data to restore the session
          const response = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({ token, ...response.data });
        } catch (error) {
          // If the token is expired or invalid, clear it out
          console.error("Session expired.");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Updated to accept userData alongside the token
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser({ token, ...userData });
    navigate("/dashboard"); // Always route to dashboard for staff
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/administration");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
