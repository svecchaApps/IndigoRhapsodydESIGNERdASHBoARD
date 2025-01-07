import { ThemeProvider } from "styled-components";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import Loginscreen from "./screens/loginScreen/Loginscreen"; // Import the login screen
import PageNotFound from "./screens/error/PageNotFound";
import { theme } from "./styles/theme/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "./styles/global/GlobalStyles";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./screens/products/productsPage";
import OrderScreen from "./screens/orders/orderScreen";
import ShippingPage from "./screens/shipping/shippingPage";
import ReturnRequest from "./screens/returnRequest/ReturnRequest";
import ProfileScreen from "./screens/profile/profileScreen";
import "react-toastify/dist/ReactToastify.css";
import NotificationScreen from "./screens/notifications/notificationScreen";
// import SignupScreen from "./screens/signUpScreen/SignupScreen";

const routes = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <DashboardScreen />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "orders",
        element: <OrderScreen />,
      },
      {
        path: "shippingDetails",
        element: <ShippingPage />,
      },
      {
        path: "notifications",
        element: <NotificationScreen />,
      },
    ],
  },
  {
    path: "/login", // Add this route for the login page
    element: <Loginscreen />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <GlobalStyles />

        <Routes>
          <Route path="/" element={<Loginscreen />} /> {/* Default route */}
          <Route path="/signup" element={<SignupScreen />} />
          {/* Signup route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <BaseLayout>
                  <DashboardScreen />
                </BaseLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardScreen />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrderScreen />} />
            <Route path="shippingDetails" element={<ShippingPage />} />
            <Route path="returnRequest" element={<ReturnRequest />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="notifications" element={<NotificationScreen />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
