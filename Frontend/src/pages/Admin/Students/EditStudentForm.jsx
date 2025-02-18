import { useState } from 'react';
import './AddStudentForm.css'; // We can reuse the styles
import { toast } from 'react-hot-toast';

const EditStudentForm = ({ student, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: student.name,
        dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
        gender: student.gender,
        parentName: student.parentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        address: student.address,
        class: student.class,
        status: student.status,
        medicalInfo: {
            allergies: student.medicalInfo.allergies.join(', '),
            medications: student.medicalInfo.medications.join(', '),
            specialNeeds: student.medicalInfo.specialNeeds || ''
        }
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(student.photo.url);

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
        try {
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

            // Append photo if changed
            if (photo) {
                formDataToSend.append('photo', photo);
            }

            await onSubmit(student._id, formDataToSend);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Error updating student. Please try again.');
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>Edit Student</h2>
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
                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                        </div>

                        <div className="form-group photo-upload">
                            <label>Student Photo</label>
                            <div className="photo-preview">
                                <img src={previewUrl} alt="Preview" />
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentForm; 