import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import '../pages/Admin/AdminDashboard.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:4000/api/v1/admin/logout', {
                withCredentials: true
            });
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <header className="admin-header">
                <div className="admin-header-content" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 20px',
                    height: '80px',
                    position: 'relative'
                }}>
                   
                    
                    <button 
                        onClick={handleLogout} 
                        className="logout-button" 
                        style={{ 
                            color: 'white',
                            position: 'absolute',
                            right: '-200px',
                            margin: '0',
                            padding: '10px 25px',
                            borderRadius: '35px',
                            background: 'linear-gradient(140deg, #ff6b6b, #4ecdc4)',
                            border: 'none',
                            cursor: 'pointer',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    > 
                        Logout
                    </button>
                </div>
            </header>
            <AdminSidebar 
                isExpanded={isSidebarExpanded} 
                onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
            />
            <div className={`dashboard-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}
            
            >
                {children}
            </div>
        </div>
    );
};

export default AdminLayout; 