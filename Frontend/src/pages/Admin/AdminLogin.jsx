import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminAuth.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/v1/admin/login',
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            if (data.success) {
                alert('Login successful!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Login</h1>
                <p className="auth-subtitle">Welcome back!</p>
                
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="form-input"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        Login
                    </button>

                    <p className="auth-link-text">
                        Don't have an account?{' '}
                        <Link to="/admin/signup" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin; 