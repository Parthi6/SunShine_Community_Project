import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ClasswiseAttendance.css';

const ClasswiseAttendance = ({ selectedDate, selectedClass, updateTrigger }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [allClassesData, setAllClassesData] = useState({}); // For the graph
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        late: 0
    });

    useEffect(() => {
        if (selectedDate) {
            fetchAttendanceData();
        }
    }, [selectedDate, selectedClass, updateTrigger]);

    const fetchAttendanceData = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            
            // Get all students
            const studentsResponse = await axios.get(
                'http://localhost:4000/api/v1/students',
                { withCredentials: true }
            );
            
            const attendanceResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/by-date/${formattedDate}`,
                { withCredentials: true }
            );

            const attendanceRecords = attendanceResponse.data.attendance || [];
            const attendanceMap = new Map(
                attendanceRecords
                    .filter(record => record && record.student)
                    .map(record => [record.student._id, record])
            );

            // Process data for all classes (for graph)
            const allStudents = studentsResponse.data.students.filter(student => 
                student && student.status === 'Active'
            );

            // Calculate attendance by class for the graph
            const classwiseStats = allStudents.reduce((acc, student) => {
                const className = student.class;
                if (!acc[className]) {
                    acc[className] = { present: 0, absent: 0, total: 0 };
                }
                
                const status = attendanceMap.get(student._id)?.status?.toLowerCase() || 'absent';
                acc[className].total++;
                if (status === 'present') {
                    acc[className].present++;
                } else {
                    acc[className].absent++;
                }
                
                return acc;
            }, {});

            setAllClassesData(classwiseStats);

            // Filter students for the table display based on selected class
            let filteredStudents = allStudents;
            if (selectedClass !== 'all') {
                filteredStudents = allStudents.filter(student => 
                    student.class === selectedClass
                );
            }

            // Process data for the table
            const combinedData = filteredStudents
                .map(student => ({
                    student: {
                        _id: student._id,
                        name: student.name,
                        class: student.class,
                        photo: student.photo || { url: 'default-photo-url.jpg' }
                    },
                    status: (attendanceMap.get(student._id)?.status || 'Absent')
                }))
                .sort((a, b) => {
                    if (a.student.class !== b.student.class) {
                        return a.student.class.localeCompare(b.student.class);
                    }
                    return a.student.name.localeCompare(b.student.name);
                });

            setAttendanceData(combinedData);

            // Update stats for the selected view
            const newStats = combinedData.reduce((acc, curr) => {
                acc.total++;
                const status = curr.status.toLowerCase();
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, { total: 0, present: 0, absent: 0, late: 0 });

            setStats(newStats);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Error fetching attendance records');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="attendance-loading">Loading attendance records...</div>;
    }

    return (
        <div className="attendance-overview">
            <h2 className="overview-title">Attendance Overview</h2>
            
            <div className="attendance-stats">
                <div className="stat-card total">
                    <h4>Total Students</h4>
                    <span>{stats.total}</span>
                </div>
                <div className="stat-card present">
                    <h4>Present</h4>
                    <span>{stats.present}</span>
                </div>
                <div className="stat-card late">
                    <h4>Late</h4>
                    <span>{stats.late}</span>
                </div>
                <div className="stat-card absent">
                    <h4>Absent</h4>
                    <span>{stats.absent}</span>
                </div>
            </div>

            <div className="attendance-table-wrapper">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Status</th>
                            <th>Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map(({ student, status }) => (
                            <tr key={student._id}>
                                <td className="student-cell">
                                    <img 
                                        src={student.photo.url} 
                                        alt={student.name} 
                                        className="student-photo"
                                    />
                                    <span>{student.name}</span>
                                </td>
                                <td>
                                    <span className={`attendance-status-indicator ${status.toLowerCase()}-status`}>
                                        {status}
                                    </span>
                                </td>
                                <td>{student.class}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClasswiseAttendance; 