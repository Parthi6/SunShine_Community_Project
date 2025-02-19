import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaUserGraduate, FaEnvelope, FaPhone, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import AdminLayout from '../../../components/AdminLayout';
import './Enrollments.css';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

    const fetchEnrollments = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/enrollment/all', {
                withCredentials: true
            });
            setEnrollments(data.enrollments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            toast.error(error.response?.data?.message || 'Error fetching enrollments');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(
                `http://localhost:4000/api/v1/enrollment/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );

            setEnrollments(enrollments.map(enrollment => 
                enrollment._id === id ? { ...enrollment, status: newStatus } : enrollment
            ));

            toast.success(`Application ${newStatus} successfully`);
            fetchEnrollments();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.response?.data?.message || 'Error updating application status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enrollment?')) {
            try {
                await axios.delete(
                    `http://localhost:4000/api/v1/enrollment/${id}`,
                    { withCredentials: true }
                );

                setEnrollments(enrollments.filter(enrollment => enrollment._id !== id));
                toast.success('Enrollment deleted successfully');
                fetchEnrollments();
            } catch (error) {
                console.error('Error deleting enrollment:', error);
                toast.error(error.response?.data?.message || 'Error deleting enrollment');
            }
        }
    };

    const filteredEnrollments = enrollments.filter(enrollment => {
        if (filter === 'all') return true;
        return enrollment.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'warning';
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="loading-state">Loading...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="enrollments-container">
                <div className="enrollments-header">
                    <h1>Enrollment Applications</h1>
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Applications
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                            onClick={() => setFilter('approved')}
                        >
                            Approved
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                            onClick={() => setFilter('rejected')}
                        >
                            Rejected
                        </button>
                    </div>
                </div>

                <div className="enrollments-grid">
                    {filteredEnrollments.map((enrollment) => (
                        <div key={enrollment._id} className="enrollment-card">
                            <div className={`status-badge ${enrollment.status}`}>
                                {enrollment.status}
                            </div>
                            
                            <div className="card-content">
                                <div className="student-name">
                                    <FaUserGraduate className="icon" />
                                    <h3>{enrollment.studentName}</h3>
                                </div>

                                <div className="info-grid">
                                    <div className="info-item">
                                        <FaIdCard className="icon" />
                                        <div>
                                            <label>Parent</label>
                                            <p>{enrollment.parentName}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaCalendarAlt className="icon" />
                                        <div>
                                            <label>DOB</label>
                                            <p>{new Date(enrollment.dob).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaPhone className="icon" />
                                        <div>
                                            <label>Contact</label>
                                            <p>{enrollment.phone}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <FaEnvelope className="icon" />
                                        <div>
                                            <label>Email</label>
                                            <p>{enrollment.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {enrollment.additionalNotes && (
                                    <div className="notes-section">
                                        <p>{enrollment.additionalNotes}</p>
                                    </div>
                                )}

                                <div className="card-actions">
                                    {enrollment.status === 'pending' && (
                                        <>
                                            <button 
                                                className="action-btn approve"
                                                onClick={() => handleStatusUpdate(enrollment._id, 'approved')}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                className="action-btn reject"
                                                onClick={() => handleStatusUpdate(enrollment._id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        className="action-btn delete"
                                        onClick={() => handleDelete(enrollment._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Enrollments; 