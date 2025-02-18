import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        enrollments: 0,
        students: 0,
        messages: 0
    });
  const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:4000/api/v1/admin/dashboard',
                    { withCredentials: true }
                );
                if (data.success) {
                    setAdmin(data.admin);
                    // You can add real stats here when available
                    setStats({
                        enrollments: 12,
                        students: 45,
                        messages: 8
                    });
                }
            } catch (error) {
                console.error('Dashboard error:', error);
    navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

  return (
        <AdminLayout>
            <div className="dashboard-container">
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h2 className="welcome-title">WELCOME, {admin?.name.toUpperCase()}!</h2>
                        <p className="welcome-info">Email: {admin?.email}</p>
                        <p className="welcome-info">Role: {admin?.role}</p>
                    </div>

                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <h3 className="stat-label">Total Enrollments</h3>
                            <div className="stat-number">{stats.enrollments}</div>
                            <p className="stat-sublabel">Active Applications</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">Current Students</h3>
                            <div className="stat-number">{stats.students}</div>
                            <p className="stat-sublabel">Enrolled Students</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">New Messages</h3>
                            <div className="stat-number">{stats.messages}</div>
                            <p className="stat-sublabel">Unread Messages</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
  );
};

export default AdminDashboard; 