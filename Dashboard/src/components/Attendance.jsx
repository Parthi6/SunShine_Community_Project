import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // Keeps track of attendance for each student

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/enrollment/getall", { withCredentials: true });
        const acceptedStudents = data.enrollment.filter(student => student.status === "Accepted"); // Filter only accepted students
        setStudents(acceptedStudents);
      } catch (error) {
        toast.error("Error fetching students.");
      }
    };
    fetchStudents();
  }, []); // Only runs once when the component mounts

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/attendance/mark", 
        { attendance }, 
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to submit attendance.");
    }
  };

  return (
    <div className="attendance-page">
      <h1>Student Attendance</h1>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>{`${student.studentName}`}</td> {/* Assuming `studentName` is the field in enrollment schema */}
                <td>
                  <select
                    value={attendance[student._id] || "Absent"}
                    onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleSubmitAttendance}>Submit Attendance</button>
    </div>
  );
};

export default Attendance;