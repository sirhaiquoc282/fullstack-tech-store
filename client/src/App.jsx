import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import Router from "./routers/Router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />

      <RouterProvider router={Router} />
    </Provider>
  );
}

export default App;
