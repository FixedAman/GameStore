import { useEffect } from "react";

export const useSubscriptionVerifier = (sessionId, onVerified) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !sessionId) return;
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/payment/verify-subscription?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          console.log(`Data is verified`, data.message);
          onVerified();
        } else {
          console.warn(`Data is not verified `, data.message);
        }
      } catch (error) {
        console.log(
          "this is error message from userSubscription ",
          error.message
        );
      }
    };
    verify();
  }, [sessionId]);
};
