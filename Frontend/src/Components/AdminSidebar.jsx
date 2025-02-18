import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';
import { 
    FaHome, 
    FaUserGraduate, 
    FaCalendarAlt, 
    FaEnvelope, 
    FaImages,
    FaUserCog,
    FaChartBar,
    FaFileAlt,
    FaCog
} from 'react-icons/fa';

const AdminSidebar = () => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        {
            path: '/admin/dashboard',
            name: 'Dashboard',
            icon: <FaHome />
        },
        {
            path: '/admin/students',
            name: 'Students',
            icon: <FaUserGraduate />
        },
        {
            path: '/admin/attendance',
            name: 'Attendance',
            icon: <FaCalendarAlt />
        },
        {
            path: '/admin/enrollments',
            name: 'Enrollments',
            icon: <FaFileAlt />
        },
        {
            path: '/admin/messages',
            name: 'Messages',
            icon: <FaEnvelope />
        },
        {
            path: '/admin/gallery',
            name: 'Gallery',
            icon: <FaImages />
        },
        {
            path: '/admin/staff',
            name: 'Staff Management',
            icon: <FaUserCog />
        },
        {
            path: '/admin/reports',
            name: 'Reports',
            icon: <FaChartBar />
        },
        {
            path: '/admin/settings',
            name: 'Settings',
            icon: <FaCog />
        }
    ];

    return (
        <div className={`admin-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button 
                className="toggle-button"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? '◄' : '►'}
            </button>
            
            <div className="sidebar-content">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {isExpanded && <span className="text">{item.name}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminSidebar; 