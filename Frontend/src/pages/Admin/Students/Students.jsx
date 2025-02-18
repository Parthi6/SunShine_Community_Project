import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';
import StudentCard from './StudentCard';
import AddStudentForm from './AddStudentForm';
import StudentAnalytics from './StudentAnalytics';
import { toast } from 'react-toastify';
import './Students.css';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [analytics, setAnalytics] = useState({
        totalStudents: 0,
        activeStudents: 0,
        byClass: {},
        byGender: {}
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/students', {
                withCredentials: true
            });
            setStudents(data.students);
            calculateAnalytics(data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (studentData) => {
        const analytics = {
            totalStudents: studentData.length,
            activeStudents: studentData.filter(s => s.status === 'Active').length,
            byClass: {},
            byGender: {}
        };

        studentData.forEach(student => {
            // Count by class
            analytics.byClass[student.class] = (analytics.byClass[student.class] || 0) + 1;
            // Count by gender
            analytics.byGender[student.gender] = (analytics.byGender[student.gender] || 0) + 1;
        });

        setAnalytics(analytics);
    };

    const handleAddStudent = async (studentData) => {
        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/v1/students',
                studentData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setStudents(prevStudents => [...prevStudents, data.student]);
            setShowAddForm(false);
            calculateAnalytics([...students, data.student]);
            toast.success('Student added successfully');
        } catch (error) {
            console.error('Error adding student:', error);
            toast.error(
                error.response?.data?.message || 
                'Error adding student. Please try again.'
            );
        }
    };

    const handleUpdateStudent = async (studentId, formData) => {
        try {
            console.log('Updating student with data:', Object.fromEntries(formData));
            
            const { data } = await axios.put(
                `http://localhost:4000/api/v1/students/${studentId}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (data.success) {
                toast.success('Student updated successfully');
                fetchStudents(); // Refresh the students list
            }
        } catch (error) {
            console.error('Error updating student:', error.response || error);
            toast.error(
                error.response?.data?.message || 
                'Error updating student. Please try again.'
            );
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AdminLayout>
            <div className="students-container">
                <div className="students-header">
                    <h1>Student Management</h1>
                    <button 
                        className="add-student-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        Add New Student
                    </button>
                </div>

                <StudentAnalytics analytics={analytics} />

                {showAddForm && (
                    <AddStudentForm 
                        onSubmit={handleAddStudent}
                        onClose={() => setShowAddForm(false)}
                    />
                )}

                <div className="students-grid">
                    {students.map(student => (
                        <StudentCard 
                            key={student._id}
                            student={student}
                            onUpdate={handleUpdateStudent}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Students; 