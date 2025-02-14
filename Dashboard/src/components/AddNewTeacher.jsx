import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddNewTeacher = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  // const [tecDepartment, setTeacherDepartment] = useState("");
  // const [tecAvatar, setTecAvatar] = useState("");
  // const [tecAvatarPreview, setTecAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  // const departmentsArray = [
  //   "Engineering",
  //   "Civil",
  //   "ICT",
  //   "Food",
  //   "PST",
  //   "CIS",
  //   "Physical",
  //   
  // ];

  // const handleAvatar = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     se(reader.result);
  //     setTecAvatar(file);
  //   };
  // };

  const handleAddNewTeacher = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      // formData.append("teacherDepartment", teacherDepartment);
      // formData.append("tecAvatar", tecAvatar);
      await axios
        .post("http://localhost:4000/api/v1/user/teacher/addnew", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setNic("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="page">
      <section className="container add-teacher-form">
        <img src="/logo.png" alt="logo" className="logo"/>
        <h1 className="form-title">REGISTER A NEW TEACHER</h1>
        <form onSubmit={handleAddNewTeacher}>
          <div className="first-wrapper">
            <div>
              {/* <img
                src={
                  tecAvatarPreview ? `${tecAvatarPreview}` : "/tecHolder.jpg"
                }
                alt="Teacher Avatar"
              /> */}
              {/* <input type="file" onChange={handleAvatar} /> */}
            </div>
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="number"
                placeholder="NIC"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <select
                value={teacherDepartment}
                onChange={(e) => {
                  setTeacherDepartment(e.target.value);
                }}
              > */}
                {/* <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => {
                  return (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  );
                })} */}
              
              <button type="submit">Register New Teacher</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewTeacher;
