import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiCalendarCheck } from "react-icons/bi"; // New icon for attendance
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/admin/logout", { withCredentials: true });
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const gotoPage = (path) => {
    setShow(false);  // Close the sidebar
    navigate(path);  // Navigate to the path
  };

  return (
    <>
      <nav style={!isAuthenticated ? { display: "none" } : { display: "flex" }} className={show ? "show sidebar" : "sidebar"}>
        <div className="links">
          <TiHome onClick={() => gotoPage("/")} />
          <FaUserCircle onClick={() => gotoPage("/teachers")} />
          <MdAddModerator onClick={() => gotoPage("/admin/addnew")} />
          <IoPersonAddSharp onClick={() => gotoPage("/teacher/addnew")} />
          <AiFillMessage onClick={() => gotoPage("/messages")} />
          <BiCalendarCheck onClick={() => gotoPage("/attendance")} /> {/* Added Attendance Link */}
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div className="wrapper" style={!isAuthenticated ? { display: "none" } : { display: "flex" }}>
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;