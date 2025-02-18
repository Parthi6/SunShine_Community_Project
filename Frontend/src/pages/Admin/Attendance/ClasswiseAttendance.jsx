import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ClasswiseAttendance = ({ selectedDate, selectedClass, updateTrigger }) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        present: 0,
        absent: 0,
        late: 0
    });

    useEffect(() => {
        fetchAttendanceData();
    }, [selectedDate, selectedClass, updateTrigger]);

    const fetchAttendanceData = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            
            // First fetch all students
            const studentsResponse = await axios.get(
                `http://localhost:4000/api/v1/students${selectedClass !== 'all' ? `?class=${selectedClass}` : ''}`,
                { withCredentials: true }
            );
            
            // Then fetch attendance for the date
            const attendanceResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/by-date/${formattedDate}`,
                { withCredentials: true }
            );

            // Create a map of attendance records
            const attendanceMap = new Map(
                attendanceResponse.data.attendance.map(record => [record.student._id, record])
            );

            // Combine student data with attendance data
            const combinedData = studentsResponse.data.students
                .map(student => {
                    const attendanceRecord = attendanceMap.get(student._id);
                    return {
                        student: {
                            _id: student._id,
                            name: student.name,
                            class: student.class,
                            photo: student.photo
                        },
                        status: attendanceRecord?.status || 'Absent'
                    };
                })
                .sort((a, b) => {
                    // First sort by class
                    if (a.student.class !== b.student.class) {
                        return a.student.class.localeCompare(b.student.class);
                    }
                    // Then by name within the same class
                    return a.student.name.localeCompare(b.student.name);
                });

            setAttendanceData(combinedData);

            // Calculate stats
            const newStats = combinedData.reduce((acc, curr) => {
                acc[curr.status.toLowerCase()]++;
                return acc;
            }, { present: 0, absent: 0, late: 0 });

            setStats(newStats);

            if (updateTrigger > 0) {
                const statusCells = document.querySelectorAll('.status-cell');
                statusCells.forEach(cell => {
                    cell.classList.add('updated');
                    setTimeout(() => cell.classList.remove('updated'), 300);
                });
            }
        } catch (error) {
            toast.error('Error fetching attendance records');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Present':
                return 'status-present';
            case 'Absent':
                return 'status-absent';
            case 'Late':
                return 'status-late';
            default:
                return '';
        }
    };

    if (loading) {
        return <div className="loading">Loading attendance records...</div>;
    }

    const attendancePercentage = stats.total ? 
        ((stats.present + stats.late) / stats.total * 100).toFixed(1) : 0;

    return (
        <div className="classwise-attendance">
            <h2 style={{ marginLeft: '20px', marginTop: '5px' }}>Class Attendance Overview</h2>
            <div className="attendance-table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th className="student-col">Student</th>
                            <th className="status-col">Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="no-data">
                                    No attendance records for this date
                                </td>
                            </tr>
                        ) : (
                            attendanceData.map(({ student, status }) => (
                                <tr key={student._id}>
                                    <td className="student-cell">
                                        <div className="student-info">
                                            <img 
                                                src={student.photo.url} 
                                                alt={student.name} 
                                                className="student-photo"
                                            />
                                            <div className="student-details">
                                                <span className="student-name">{student.name}</span>
                                                <span className="student-class">{student.class}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="status-cell">
                                        <span className={`status-badge ${status.toLowerCase()}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {attendanceData.length > 0 && (
                <div className="attendance-summary">
                    <div className="summary-stats">
                        <div className="stat-item">
                            <span className="stat-label">Present:</span>
                            <span className="stat-value present">{stats.present}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Late:</span>
                            <span className="stat-value late">{stats.late}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Absent:</span>
                            <span className="stat-value absent">{stats.absent}</span>
                        </div>
                    </div>
                    <div className="attendance-rate">
                        <span className="rate-label">Attendance Rate:</span>
                        <span className="rate-value">{attendancePercentage}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClasswiseAttendance; 