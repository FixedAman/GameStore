import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Store from "./pages/Store";
import GameDetails from "./pages/GameDetails";
import CustomNavbar from "./components/Navbar";
import { Logout } from "./pages/Logout";
import Error from "./pages/Error";
import PaymentPage from "./pages/PaymentPage";
import Plans from "./pages/Plans";
import AdminUsers from "./pages/Admin-Users";
import AdminContacts from "./pages/Admin-Contacts";
import AdminUpdate from "./pages/Admin-Update";
import { Footer } from "./components/Footer";
import StoreProtected from "./pages/StoreProtected";

import AdminLayout from "./components/layout/Admin-Layout";
import VerifySubscriptionPage from "./components/verify-subscription";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<StoreProtected />} />
          <Route path="/store/game/:id" element={<GameDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Error />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/games/:id/payment" element={<PaymentPage />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id/edit" element={<AdminUpdate />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
          <Route
            path="/verify-subscription"
            element={<VerifySubscriptionPage />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
