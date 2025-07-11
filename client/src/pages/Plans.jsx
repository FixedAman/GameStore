import { useAuth } from "../store/auth";
import {
  FaStar,
  FaGamepad,
  FaAward,
  FaCloud,
  FaHeadphonesAlt,
  FaShieldAlt,
  FaPlay,
} from "react-icons/fa"; // Import necessary icons from react-icons

const Plans = () => {
  const { data } = useAuth();
  const { person } = useAuth();

  console.log("Data:", person);
  console.log("token", localStorage.getItem("token"));
  const handleCheckout = async (plan) => {
    const getThePrice = parseInt(plan.price);

    try {
      const res = await fetch(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planName: plan.planName,
            price: getThePrice,
            email: person?.email,
            isSubscription: true,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.log("this is error text", errorText);
        throw new Error("Failed to create checkout session");
      }
      const resData = await res.json();
      if (resData.url) {
        window.location.href = resData.url;
      }
    } catch (error) {
      console.error("Bro is broken ", error.message);
    }
  };

  // Ensure data is an array before attempting to use map
  if (!Array.isArray(data)) {
    console.error("Expected data to be an array, but got:", data);
    return <p>Error: Invalid data format.</p>; // Display an error message or fallback UI
  }

  return (
    <section className="bg-zinc-800 min-h-screen flex items-center justify-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Subscription Plans
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {data.map((currElem, index) => {
            const { planName, price, currency, benefits } = currElem;

            // Check if currElem is an object with the expected properties
            if (
              typeof currElem !== "object" ||
              !currElem.planName ||
              !currElem.price ||
              !currElem.currency
            ) {
              console.error("Unexpected plan item:", currElem);
              return <p key={index}>Error: Invalid plan item.</p>;
            }

            return (
              <div
                className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-xl hover:border-gray-500 hover:border-2 hover:bg-gray-900 cursor-pointer"
                key={index}
              >
                <div>
                  <div className="flex items-center mb-4">
                    <FaStar className="text-yellow-500 mr-2" />
                    <p className="text-xl font-semibold">{planName}</p>
                  </div>
                  {benefits.map((curr, index) => {
                    let icon;
                    switch (curr.description) {
                      case "Free Games Every Month":
                        icon = (
                          <FaGamepad className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Exclusive Game Store Discounts":
                        icon = (
                          <FaAward className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Access to Monthly Challenges":
                        icon = (
                          <FaPlay className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Limited Cloud Save Storage":
                        icon = (
                          <FaCloud className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Enhanced Store Discounts":
                        icon = (
                          <FaAward className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Access to Exclusive In-Game Content":
                        icon = (
                          <FaShieldAlt className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Priority Customer Support":
                        icon = (
                          <FaHeadphonesAlt className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Extended Cloud Save Storage":
                        icon = (
                          <FaCloud className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Exclusive Access to Beta Tests":
                        icon = (
                          <FaPlay className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Access to Premium In-Game Content":
                        icon = (
                          <FaShieldAlt className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "New Game Preregistration and Early Access":
                        icon = (
                          <FaPlay className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Dedicated Cloud Save Storage":
                        icon = (
                          <FaCloud className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Exclusive Access to Game Store Events":
                        icon = (
                          <FaAward className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "Monthly Digital Goodies":
                        icon = (
                          <FaAward className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      case "VIP Customer Support":
                        icon = (
                          <FaHeadphonesAlt className="inline-block text-blue-500 mr-1" />
                        );
                        break;
                      default:
                        icon = (
                          <FaStar className="inline-block text-blue-500 mr-1" />
                        ); // Use a star as a fallback
                    }

                    return (
                      <p
                        className="text-gray-600 mb-2 text-2xl text-pretty "
                        key={index}
                      >
                        {icon}
                        {curr.description}
                      </p>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h1 className="text-2xl font-bold">
                    <button
                      className="w-full bg-yellow-300 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all text-xl"
                      onClick={() => handleCheckout(currElem)}
                    >
                      {currency} {price} - Buy now
                    </button>
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Plans;
