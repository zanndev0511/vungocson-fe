import ProtectedRoute from "@components/common/ProtectedRoute";
import {
  About,
  Account,
  Addresses,
  Collections,
  ContactUs,
  FAQ,
  ForgetPassword,
  Home,
  MadeToOrder,
  MenuPages,
  MyOrders,
  News,
  NewsDetails,
  Notify,
  Payment,
  PrivacyPolicy,
  ProductDetail,
  ResetPasswordForm,
  RunWay,
  RunWayDetail,
  Shop,
  SignUp,
  TermAndCondition,
  Wishlist,
} from "@constants/index";
import { Result } from "@pages/Result";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/collection/:id/:slug" element={<Collections />} />
    <Route path="/made-to-order" element={<MadeToOrder />} />
    <Route path="/about" element={<About />} />
    <Route path="/news" element={<News />} />
    <Route path="/news/:id/:slug" element={<NewsDetails />} />
    <Route path="/runway" element={<RunWay />} />
    <Route path="/runway/:id/:slug" element={<RunWayDetail />} />
    <Route path="/shop/:menu" element={<MenuPages />} />
    <Route path="/shop/product/:id/:slug" element={<ProductDetail />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/forget-password" element={<ForgetPassword />} />
    <Route path="/reset-password" element={<ResetPasswordForm />} />
    <Route path="/search" element={<Result />} />
    <Route
      path="/me/account"
      element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      }
    />
    <Route
      path="/me/orders"
      element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/me/addresses"
      element={
        <ProtectedRoute>
          <Addresses />
        </ProtectedRoute>
      }
    />
    <Route
      path="/me/wishlist"
      element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <PayPalScriptProvider
            options={{
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID!,
              currency: "USD",
            }}
          >
            <Payment />
          </PayPalScriptProvider>
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/notify"
      element={
        <ProtectedRoute>
          <Notify />
        </ProtectedRoute>
      }
    />
    <Route path="/support/contact" element={<ContactUs />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-and-conditions" element={<TermAndCondition />} />
    <Route path="/support/faq" element={<FAQ />} />
  </Routes>
);

export default AppRoutes;
