import React from "react";

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "@components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <div className="App">
          <AppRoutes />
        </div>
        <ToastContainer />
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default App;
