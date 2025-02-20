import { useState } from 'react';
import './EditStudentForm.css';
import { toast } from 'react-hot-toast';

const EditStudentForm = ({ student, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: student.name,
        dateOfBirth: new Date(student.dateOfBirth).toISOString().split('T')[0],
        gender: student.gender,
        class: student.class,
        status: student.status,
        parentName: student.parentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone,
        address: student.address,
        medicalInfo: {
            allergies: student.medicalInfo?.allergies || [],
            medications: student.medicalInfo?.medications || [],
            specialNeeds: student.medicalInfo?.specialNeeds || ''
        }
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(student.photo.url);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('medicalInfo.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                medicalInfo: {
                    ...prev.medicalInfo,
                    [field]: field === 'allergies' || field === 'medications' 
                        ? value.split(',').map(item => item.trim())
                        : value
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
            if (file.size > 1024 * 1024) { // 1MB limit
                toast.error('Image size should be less than 1MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setPhoto(file);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPhotoPreview(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const submitData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'medicalInfo') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // Append photo if changed
            if (photo) {
                submitData.append('photo', photo);
            }

            await onSubmit(student._id, submitData);
            toast.success('Student updated successfully');
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.response?.data?.message || 'Error updating student');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="edit-student-modal">
                <div className="modal-header">
                    <h2>Edit Student</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-student-form">
                    <div className="form-sections">
                        {/* Student Photo Section */}
                        <div className="form-section">
                            <h3 className="section-title">Student Photo</h3>
                            <div className="photo-upload-container">
                                <div className="photo-preview">
                                    <img 
                                        src={photoPreview} 
                                        alt="Student" 
                                        className="preview-image"
                                    />
                                </div>
                                <div className="photo-input-container">
                                    <label htmlFor="photo-upload" className="photo-upload-label">
                                        Choose New Photo
                                    </label>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="photo-input"
                                    />
                                    <p className="photo-help-text">
                                        Maximum size: 1MB. Supported formats: JPG, PNG
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>
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
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Class</label>
                                    <select name="class" value={formData.class} onChange={handleChange}>
                                        <option value="Toddler">Toddler</option>
                                        <option value="PreK-1">PreK-1</option>
                                        <option value="PreK-2">PreK-2</option>
                                        <option value="Kindergarten">Kindergarten</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Parent Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">Parent Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Parent Name</label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Parent Email</label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        value={formData.parentEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Parent Phone</label>
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
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Medical Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">Medical Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Allergies</label>
                                    <input
                                        type="text"
                                        name="medicalInfo.allergies"
                                        value={formData.medicalInfo.allergies.join(', ')}
                                        onChange={handleChange}
                                        placeholder="Separate with commas"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Medications</label>
                                    <input
                                        type="text"
                                        name="medicalInfo.medications"
                                        value={formData.medicalInfo.medications.join(', ')}
                                        onChange={handleChange}
                                        placeholder="Separate with commas"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Special Needs</label>
                                    <textarea
                                        name="medicalInfo.specialNeeds"
                                        value={formData.medicalInfo.specialNeeds}
                                        onChange={handleChange}
                                        placeholder="Describe any special needs or requirements"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentForm; 