import { useNavigate } from "react-router-dom";
import Store from "./Store";
import { useEffect, useState } from "react";
const StoreProtected = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("login");
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/store-protected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setIsAuthorized(true);
        } else {
          navigate("/plans");
        }
      } catch (error) {
        console.log("Problem in ProtectedRoute", error.message);
        navigate("/plans");
      }
    };
    verifyAccess();
  }, [navigate]);
  if (!isAuthorized) {
    return <h1 className="text-white text-center mt-10">Checking access...</h1>;
  }
  return <Store />;
};
export default StoreProtected;
