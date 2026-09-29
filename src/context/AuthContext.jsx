import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  setAccessToken as storeAccessToken ,
  clearAccessToken,
} from "../utils/Token";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session when application starts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Get a new access token using HTTP-only refresh cookie
        const refreshResponse = await api.post("/auth/refresh");

        const newAccessToken =
          refreshResponse.data.data.accessToken;

        // 2. Store new access token
        setAccessToken(newAccessToken);

        // Token manager
storeAccessToken(newAccessToken);

        // 3. Get current logged-in user
        const userResponse = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        // IMPORTANT:
        // /auth/me returns the user directly inside data
        setUser(userResponse.data.data);
      } catch (error) {
        console.log(
          "Session restore failed:",
          error.response?.data?.message
        );

        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data.data;
      //react state
      setUser(user);
      setAccessToken(accessToken);
      // Token manager for Axios interceptor
    storeAccessToken(accessToken);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      clearAccessToken();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};