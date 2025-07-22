import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { ColorRing } from "react-loader-spinner";
import Spinner from "react-bootstrap/esm/Spinner";
const VerifySubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { userAuthentication } = useAuth();
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token || !sessionId) {
        console.log("token ba session id nei ");
      }
      try {
        const invoicesRes = await fetch(
          `https://my-app-backend-5yod.onrender.com/api/payment/get-invoice?session_id=${sessionId}`
        );
        const { pdfUrl } = await invoicesRes.json();
        window.location.href = pdfUrl;
        // verify payment
        const verifyRes = await fetch(
          `https://my-app-backend-5yod.onrender.com/api/payment/verify-subscription?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await verifyRes.json();
        console.log("Verification:", data.message);
        // refresh Auth
        userAuthentication();
        // nevigate
        navigate("/store");
      } catch (error) {
        console.log(`Error is here  ${error.message}`);
        navigate("/");
      }
    };
    verify();
  }, [sessionId, navigate]);

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-zinc-900">
        <Spinner animation="grow" variant="secondary" />
        <h1 className="text-2xl font-bold text-gray-300 ml-4">Loading...</h1>
      </div>
    </>
  );
};
export default VerifySubscriptionPage;
