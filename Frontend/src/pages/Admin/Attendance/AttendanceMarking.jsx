import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AttendanceMarking = ({ date, selectedClass, onAttendanceMarked }) => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [savedAttendance, setSavedAttendance] = useState({});

    useEffect(() => {
        fetchStudents();
        // Also fetch existing attendance for this date
        fetchExistingAttendance();
    }, [selectedClass, date]);

    const fetchStudents = async () => {
        try {
            // Get all students
            const { data } = await axios.get(
                'http://localhost:4000/api/v1/students',
                { withCredentials: true }
            );
            
            // Filter and sort students using "all"
            const filteredAndSortedStudents = data.students
                .filter(student => selectedClass === 'all' || student.class === selectedClass)
                .sort((a, b) => {
                    if (a.class !== b.class) {
                        return a.class.localeCompare(b.class);
                    }
                    return a.name.localeCompare(b.name);
                });
            
            setStudents(filteredAndSortedStudents);
        } catch (error) {
            toast.error('Error fetching students');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingAttendance = async () => {
        try {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            const { data } = await axios.get(
                `http://localhost:4000/api/v1/attendances/by-date/${formattedDate}`,
                { withCredentials: true }
            );
            
            // Convert array to object for easier lookup
            const attendanceMap = {};
            data.attendance.forEach(record => {
                attendanceMap[record.student._id] = record.status;
            });
            setAttendance(attendanceMap);
            setSavedAttendance(attendanceMap);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({
                studentId,
                status
            }));

            if (records.length === 0) {
                return toast.warn('No attendance marked');
            }

            const formattedDate = new Date(date).toISOString().split('T')[0];
            
            const response = await axios.post(
                'http://localhost:4000/api/v1/attendances/mark',
                { 
                    date: formattedDate,
                    records 
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                setSavedAttendance(attendance);
                toast.success('Attendance saved successfully');
                onAttendanceMarked();
            } else {
                throw new Error(response.data.message || 'Error saving attendance');
            }
        } catch (error) {
            console.error('Attendance submission error:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Error saving attendance');
        }
    };

    if (loading) {
        return <div className="loading">Loading students...</div>;
    }

    return (
        <div className="attendance-marking">
            <h2>Mark Attendance</h2>
            {students.length === 0 ? (
                <p className="no-students">No students found for this class</p>
            ) : (
                <>
                    <div className="students-list">
                        {students.map(student => (
                            <div key={student._id} className="student-attendance-row">
                                <div className="student-info">
                                    <img 
                                        src={student.photo.url} 
                                        alt={student.name} 
                                        className="student-photo"
                                    />
                                    <span className="student-name" title={student.name}>
                                        {student.name}
                                    </span>
                                </div>
                                <div className="attendance-options">
                                    {['Present', 'Absent', 'Late'].map(status => (
                                        <button
                                            key={status}
                                            className={`status-btn ${
                                                (attendance[student._id] || savedAttendance[student._id]) === status 
                                                    ? 'active' 
                                                    : ''
                                            }`}
                                            data-status={status}
                                            onClick={() => handleAttendanceChange(student._id, status)}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="submit-attendance"
                        onClick={handleSubmit}
                    >
                        Save Attendance
                    </button>
                </>
            )}
        </div>
    );
};

export default AttendanceMarking; 