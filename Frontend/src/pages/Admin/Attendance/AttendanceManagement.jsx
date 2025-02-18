import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import AttendanceMarking from './AttendanceMarking';
import AttendanceAnalytics from './AttendanceAnalytics';
import ClasswiseAttendance from './ClasswiseAttendance';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Attendance.css';

const AttendanceManagement = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState('all');
    const [attendanceData, setAttendanceData] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const classes = ['Toddler', 'PreK-1', 'PreK-2', 'Kindergarten'];

    useEffect(() => {
        fetchAttendanceData();
        fetchAnalytics();
    }, [selectedDate, selectedClass]);

    const fetchAttendanceData = async () => {
        // Implement fetch logic
    };

    const fetchAnalytics = async () => {
        // Implement analytics fetch
    };

    const handleAttendanceMarked = () => {
        setUpdateTrigger(prev => prev + 1);
    };

    return (
        <AdminLayout>
            <div className="attendance-container">
                <div className="attendance-header">
                    <h1>Attendance Management</h1>
                    <div className="attendance-controls">
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            dateFormat="MMMM d, yyyy"
                            className="date-picker"
                        />
                        <select 
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            className="class-selector"
                        >
                            <option value="all">All Classes</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <AttendanceAnalytics 
                    selectedDate={selectedDate}
                    selectedClass={selectedClass}
                    updateTrigger={updateTrigger}
                />
                
                <div className="attendance-content">
                    <AttendanceMarking 
                        date={selectedDate}
                        selectedClass={selectedClass}
                        onAttendanceMarked={handleAttendanceMarked}
                    />
                    <ClasswiseAttendance 
                        selectedDate={selectedDate}
                        selectedClass={selectedClass}
                        updateTrigger={updateTrigger}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AttendanceManagement; 