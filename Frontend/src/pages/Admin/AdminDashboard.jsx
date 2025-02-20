import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaUserGraduate, 
  FaEnvelope, 
  FaClipboardList, 
  FaImages,
  FaCalendarCheck,
  FaUserClock
} from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        pendingEnrollments: 0,
        activeStudents: 0,
        totalMessages: 0,
        unreadMessages: 0,
        totalGalleryImages: 0,
        recentActivities: []
    });
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            // Get all required data in parallel
            const [
                adminRes, 
                enrollmentsRes, 
                messagesRes, 
                galleryRes,
                studentsRes
            ] = await Promise.all([
                axios.get('http://localhost:4000/api/v1/admin/me', { withCredentials: true }),
                axios.get('http://localhost:4000/api/v1/admin/enrollments', { withCredentials: true }),
                axios.get('http://localhost:4000/api/v1/admin/messages', { withCredentials: true }),
                axios.get('http://localhost:4000/api/v1/admin/gallery', { withCredentials: true }),
                axios.get('http://localhost:4000/api/v1/admin/students', { withCredentials: true })
            ]);

            console.log('API Responses:', {
                enrollments: enrollmentsRes.data,
                messages: messagesRes.data,
                gallery: galleryRes.data,
                students: studentsRes.data
            });

            if (adminRes.data.success) {
                setAdmin(adminRes.data.admin);

                const enrollments = enrollmentsRes.data.enrollments || [];
                const messages = messagesRes.data.messages || [];
                const gallery = galleryRes.data.images || [];
                const students = studentsRes.data.students || [];

                // Calculate real-time statistics
                const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
                const activeStudents = students.filter(s => s.status === 'active');
                const unreadMessages = messages.filter(m => !m.isRead);

                // Get recent activities and sort by date
                const activities = [
                    ...enrollments.map(e => ({
                        time: new Date(e.createdAt),
                        description: `New enrollment: ${e.childName || e.name}`,
                        type: 'enrollment'
                    })),
                    ...messages.map(m => ({
                        time: new Date(m.createdAt),
                        description: `Message from: ${m.name}`,
                        type: 'message'
                    })),
                    ...students.map(s => ({
                        time: new Date(s.createdAt),
                        description: `New student: ${s.name}`,
                        type: 'student'
                    }))
                ]
                .sort((a, b) => b.time - a.time)
                .slice(0, 5)
                .map(activity => ({
                    ...activity,
                    time: activity.time.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }));

                setStats({
                    totalEnrollments: enrollments.length,
                    pendingEnrollments: pendingEnrollments.length,
                    activeStudents: activeStudents.length,
                    totalMessages: messages.length,
                    unreadMessages: unreadMessages.length,
                    totalGalleryImages: gallery.length,
                    recentActivities: activities
                });

                console.log('Updated Stats:', {
                    totalEnrollments: enrollments.length,
                    pendingEnrollments: pendingEnrollments.length,
                    activeStudents: activeStudents.length,
                    totalMessages: messages.length,
                    unreadMessages: unreadMessages.length,
                    totalGalleryImages: gallery.length
                });
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            if (error.response?.status === 401) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Poll every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Add click handlers for quick actions
    const handleViewEnrollments = () => {
        navigate('/admin/enrollments');
    };

    const handleCheckMessages = () => {
        navigate('/admin/messages');
    };

    const handleManageGallery = () => {
        navigate('/admin/gallery');
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <AdminLayout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="admin-brand">
                        <img src="/Teacher/LOGO.png" alt="Sunshine Preschool" className="admin-logo" />
                        <div className="admin-title">
                            <h1>Sunshine Preschool Admin</h1>
                            <p className="admin-subtitle">Welcome back, {admin?.name}!</p>
                        </div>
                    </div>
                    <div className="admin-info">
                        <p><strong>Role:</strong> {admin?.role}</p>
                        <p><strong>Email:</strong> {admin?.email}</p>
                    </div>
                </div>

                <Row className="stats-grid">
                    <Col lg={4} md={6}>
                        <Card className="stat-card">
                            <Card.Body>
                                <div className="stat-icon">
                                    <FaClipboardList />
                                </div>
                                <h3>Total Enrollments</h3>
                                <div className="stat-number">{stats.totalEnrollments}</div>
                                <div className="stat-detail">
                                    <FaUserClock /> {stats.pendingEnrollments} pending applications
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} md={6}>
                        <Card className="stat-card">
                            <Card.Body>
                                <div className="stat-icon">
                                    <FaUserGraduate />
                                </div>
                                <h3>Active Students</h3>
                                <div className="stat-number">{stats.activeStudents}</div>
                                <div className="stat-detail">
                                    <FaCalendarCheck /> Currently enrolled
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} md={6}>
                        <Card className="stat-card">
                            <Card.Body>
                                <div className="stat-icon">
                                    <FaEnvelope />
                                </div>
                                <h3>Messages</h3>
                                <div className="stat-number">{stats.unreadMessages}</div>
                                <div className="stat-detail">
                                    Out of {stats.totalMessages} total messages
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} md={6}>
                        <Card className="stat-card">
                            <Card.Body>
                                <div className="stat-icon">
                                    <FaImages />
                                </div>
                                <h3>Gallery Images</h3>
                                <div className="stat-number">{stats.totalGalleryImages}</div>
                                <div className="stat-detail">
                                    Total uploaded images
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col lg={8}>
                        <Card className="recent-activities">
                            <Card.Header>
                                <h3>Recent Activities</h3>
                            </Card.Header>
                            <Card.Body>
                                {stats.recentActivities.length > 0 ? (
                                    <ul className="activity-list">
                                        {stats.recentActivities.map((activity, index) => (
                                            <li key={index} className="activity-item">
                                                <span className="activity-time">{activity.time}</span>
                                                <span className="activity-description">{activity.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No recent activities</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="quick-actions">
                            <Card.Header>
                                <h3>Quick Actions</h3>
                            </Card.Header>
                            <Card.Body>
                                <button onClick={handleViewEnrollments} className="action-btn">
                                    View Enrollments
                                </button>
                                <button onClick={handleCheckMessages} className="action-btn">
                                    Check Messages
                                </button>
                                <button onClick={handleManageGallery} className="action-btn">
                                    Manage Gallery
                                </button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard; 