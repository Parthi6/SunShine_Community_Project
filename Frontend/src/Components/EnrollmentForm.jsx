import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EnrollmentForm.css';

const EnrollmentForm = () => {
    const [formData, setFormData] = useState({
        childName: '',
        childAge: '',
        parentName: '',
        email: '',
        phone: '',
        address: '',
        program: '',
        startDate: '',
        additionalNotes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(
                'http://localhost:4000/api/v1/enrollment/create',
                formData
            );

            if (data.success) {
                toast.success('Enrollment application submitted successfully!');
                setFormData({
                    childName: '',
                    childAge: '',
                    parentName: '',
                    email: '',
                    phone: '',
                    address: '',
                    program: '',
                    startDate: '',
                    additionalNotes: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting enrollment application');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="enrollment-form">
            <h2>Enrollment Application</h2>
            
            <div className="form-section">
                <h3>Child Information</h3>
                <div className="form-group">
                    <label>Child's Full Name</label>
                    <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Child's Age</label>
                    <input
                        type="number"
                        name="childAge"
                        value={formData.childAge}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Parent Information</h3>
                <div className="form-group">
                    <label>Parent's Full Name</label>
                    <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Program Selection</h3>
                <div className="form-group">
                    <label>Program</label>
                    <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a program</option>
                        <option value="Toddler">Toddler Program (1.5-3 years)</option>
                        <option value="Preschool">Preschool Program (3-4 years)</option>
                        <option value="Kindergarten">Kindergarten Program (4-5 years)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Preferred Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                    <label>Additional Notes (Optional)</label>
                    <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        placeholder="Any special requirements or information we should know about"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Application'}
            </button>
        </form>
    );
};

export default EnrollmentForm; 