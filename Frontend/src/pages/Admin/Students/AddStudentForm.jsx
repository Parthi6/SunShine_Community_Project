import { useState } from 'react';
import './AddStudentForm.css';

const AddStudentForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        class: '',
        medicalInfo: {
            allergies: '',
            medications: '',
            specialNeeds: ''
        }
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('medicalInfo.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                medicalInfo: {
                    ...prev.medicalInfo,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append all text data
        Object.keys(formData).forEach(key => {
            if (key === 'medicalInfo') {
                formDataToSend.append(key, JSON.stringify({
                    ...formData[key],
                    allergies: formData[key].allergies.split(',').map(item => item.trim()),
                    medications: formData[key].medications.split(',').map(item => item.trim())
                }));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append photo if exists
        if (photo) {
            formDataToSend.append('photo', photo);
        }

        onSubmit(formDataToSend);
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Add New Student</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="add-student-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Class</option>
                                <option value="Toddler">Toddler</option>
                                <option value="PreK-1">PreK-1</option>
                                <option value="PreK-2">PreK-2</option>
                                <option value="Kindergarten">Kindergarten</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Parent's Name</label>
                            <input
                                type="text"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Parent's Email</label>
                            <input
                                type="email"
                                name="parentEmail"
                                value={formData.parentEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Parent's Phone</label>
                            <input
                                type="tel"
                                name="parentPhone"
                                value={formData.parentPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Allergies (comma-separated)</label>
                            <input
                                type="text"
                                name="medicalInfo.allergies"
                                value={formData.medicalInfo.allergies}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Medications (comma-separated)</label>
                            <input
                                type="text"
                                name="medicalInfo.medications"
                                value={formData.medicalInfo.medications}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Special Needs</label>
                            <textarea
                                name="medicalInfo.specialNeeds"
                                value={formData.medicalInfo.specialNeeds}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group photo-upload">
                            <label>Student Photo</label>
                            <div className="photo-preview">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" />
                                ) : (
                                    <div className="placeholder">
                                        <span>Click to add photo</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="photo-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm; 