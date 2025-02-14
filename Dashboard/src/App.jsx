import React, { useContext, useEffect } from "react";
import Teachers from "./components/Teachers"
import { Context } from "./main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Messages from "./components/Messages";
import Sidebar from "./components/Sidebar"; 
import AddNewAdmin from "./components/AddNewAdmin";
import Dashboard from "./components/Dashboard";
import "./App.css";
import axios from "axios";
import AddNewTeacher from "./components/AddNewTeacher";
import Login from "./components/Login";


const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher/addnew" element={<AddNewTeacher />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/teachers" element={<Teachers />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
