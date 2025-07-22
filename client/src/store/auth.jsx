import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [person, setPerson] = useState("");
  const [data, setData] = useState("");
  const isLoggedin = !!token;
  const authorizationData = `Bearer ${token}`;
  const [loading, setLoading] = useState(true);
  // Function to store token in LocalStorage and update state
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Function to log out the user and clear the token
  const LogoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // Function to authenticate the user based on the stored token
  const userAuthentication = async () => {
    if (!token) {
      setLoading(false);
      return;
    } // Avoid fetching if no token is available

    try {
      const response = await fetch(`https://my-app-backend-5yod.onrender.com/api/auth/user`, {
        method: "GET",
        headers: {
          Authorization: authorizationData,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPerson(data.userData);
      } else {
        // Handle non-200 status codes
        const errorData = await response.json();
        console.error("Authentication failed:", errorData.message);
      }
    } catch (error) {
      console.error("Network error during authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  const SubscriptionPlan = async () => {
    try {
      const response = await fetch(`https://my-app-backend-5yod.onrender.com/api/plan/plans`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setData(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Run authentication whenever the token changes
  useEffect(() => {
    SubscriptionPlan();
    userAuthentication();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedin,
        LogoutUser,
        storeTokenInLS,
        person,
        data,
        authorizationData,
        userAuthentication,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
