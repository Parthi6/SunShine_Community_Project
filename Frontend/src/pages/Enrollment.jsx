import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Enrollment = () => {
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fatherNic, setFatherNic] = useState("");
  const [address, setAddress] = useState("");
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/enrollment/form",
        {
          fatherName,
          email,
          phone,
          fatherNic,
          address,
          studentName,
          dob,
          gender,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      // Clear the form after successful submission
      setFatherName("");
      setEmail("");
      setPhone("");
      setFatherNic("");
      setAddress("");
      setStudentName("");
      setDob("");
      setGender("");
    } catch (error) {
      // Display an error message if request fails
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Enrollment Form</h2>
      <h4>Note: Please Before Register Then Fill the Enrollment Form</h4>
      <form onSubmit={handleEnrollment}>
        <div>
          <input
            type="text"
            placeholder="Father Name"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
          <input
            type="text"
            placeholder="NIC"
            value={fatherNic}
            onChange={(e) => setFatherNic(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>These are true Details</p>
          <input
            type="checkbox"
            style={{ flex: "none", width: "25px" }}
          />
        </div>

        <button style={{ margin: "0 auto" }}>Submit Enrollment</button>
      </form>
    </div>
  );
};

export default Enrollment;