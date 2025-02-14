import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [admin, setAdmin] = useState(null);

  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // Fetch admin details from localStorage if logged in
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/enrollment/getall",
          { withCredentials: true }
        );
        setEnrollments(data.enrollment); // Ensure the response contains 'data.enrollment'
      } catch (error) {
        setEnrollments([]);
        toast.error("Error fetching enrollments");
      }
    };
    fetchEnrollments();
  }, []);

  const handleUpdateStatus = async (enrollmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/enrollment/update/${enrollmentId}`,
        { status },
        { withCredentials: true }
      );
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment._id === enrollmentId ? { ...enrollment, status } : enrollment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="docImg" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis, nam molestias. Eaque molestiae ipsam commodi neque. Assumenda repellendus necessitatibus itaque.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Enrollments</p>
          <h3>{enrollments.length}</h3>
        </div>
        <div className="thirdBox">
          <p>Registered Parents</p>
          <h3>10</h3>
        </div>
      </div>

      <div className="banner">
        <h5>Enrollments</h5>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Father</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>
          <tbody>
            {enrollments && enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td>{enrollment.studentName}</td>
                  <td>{new Date(enrollment.dob).toLocaleDateString()}</td>
                  <td>{enrollment.fatherName}</td>
                  <td>
                    <select
                      className={
                        enrollment.status === "Pending"
                          ? "value-pending"
                          : enrollment.status === "Accepted"
                          ? "value-accepted"
                          : "value-rejected"
                      }
                      value={enrollment.status}
                      onChange={(e) =>
                        handleUpdateStatus(enrollment._id, e.target.value)
                      }
                    >
                      <option value="Pending" className="value-pending">
                        Pending
                      </option>
                      <option value="Accepted" className="value-accepted">
                        Accepted
                      </option>
                      <option value="Rejected" className="value-rejected">
                        Rejected
                      </option>
                    </select>
                  </td>
                  <td>
                    {enrollment.hasVisited ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Enrollments Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
