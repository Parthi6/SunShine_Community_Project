import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/teachers",
          { withCredentials: true }
        );
        setTeachers(data.teachers);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchTeachers();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="page teachers">
      <h1>TEACHERS</h1>
      <div className="banner">
        {teachers && teachers.length > 0 ? (
          teachers.map((element) => {
            return (
              <div className="card">
                {/* <img
                  src={element.docAvatar && element.tecAvatar.url}
                  alt="teacher avatar"
                /> */}
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  {/* <p>
                    DOB: <span>{element.dob.substring(0, 10)}</span>
                  </p> */}
                  {/* <p>
                    Department: <span>{element.tecDepartment}</span>
                  </p> */}
                  <p>
                    NIC: <span>{element.nic}</span>
                  </p>
                  {/* <p>
                    Gender: <span>{element.gender}</span>
                  </p> */}
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Teachers Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Teachers;
