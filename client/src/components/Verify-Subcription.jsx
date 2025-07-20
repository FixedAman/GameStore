import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../store/auth";

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
          `http://localhost:5000/api/payment/get-invoice?session_id=${sessionId}`
        );
        const { pdfUrl } = await invoicesRes.json();
        window.location.href = pdfUrl;
        // verify payment
        const verifyRes = await fetch(
          `http://localhost:5000/api/payment/verify-subscription?session_id=${sessionId}`,
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
        navigate("/plan");
      }
    };
    verify();
  }, [sessionId, navigate]);

  return (
    <>
      <h1>Verifying payment...</h1>
    </>
  );
};
export default VerifySubscriptionPage;
