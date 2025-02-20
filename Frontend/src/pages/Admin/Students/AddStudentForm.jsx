import { useState } from 'react';
import { toast } from 'react-hot-toast';
import './AddStudentForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddStudentForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: null,
        gender: 'Female',
        class: 'Toddler',
        status: 'Active',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        medicalInfo: {
            allergies: [],
            medications: [],
            specialNeeds: ''
        }
    });
    
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [age, setAge] = useState('');

    const calculateAge = (birthDate) => {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} years`;
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            dateOfBirth: date
        }));
        setAge(calculateAge(date));
    };

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
            if (!photo) {
                toast.error('Please upload a student photo');
                return;
            }

            if (!formData.dateOfBirth) {
                toast.error('Please select date of birth');
                return;
            }

            const submitData = new FormData();

            // Create a copy of formData with formatted date
            const formattedData = {
                ...formData,
                dateOfBirth: formData.dateOfBirth.toISOString(), // Convert date to ISO string
                medicalInfo: {
                    ...formData.medicalInfo,
                    allergies: Array.isArray(formData.medicalInfo.allergies) 
                        ? formData.medicalInfo.allergies 
                        : formData.medicalInfo.allergies.split(',').map(item => item.trim()),
                    medications: Array.isArray(formData.medicalInfo.medications)
                        ? formData.medicalInfo.medications
                        : formData.medicalInfo.medications.split(',').map(item => item.trim())
                }
            };

            // Append all form fields
            Object.keys(formattedData).forEach(key => {
                if (key === 'medicalInfo') {
                    submitData.append(key, JSON.stringify(formattedData[key]));
                } else {
                    submitData.append(key, formattedData[key]);
                }
            });

            // Append photo
            submitData.append('photo', photo);

            // Log the data being sent (for debugging)
            console.log('Submitting data:', Object.fromEntries(submitData));

            await onSubmit(submitData);
            toast.success('Student added successfully');
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error.response?.data?.message || 'Error adding student';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="add-student-modal">
                <div className="modal-header">
                    <h2>Add New Student</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="add-student-form">
                    <div className="form-container">
                        <div className="photo-section">
                            <div className="photo-preview">
                                {photoPreview ? (
                                    <img 
                                        src={photoPreview} 
                                        alt="Preview" 
                                        className="preview-image"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span>Click to add photo</span>
                                    </div>
                                )}
                            </div>
                            <label htmlFor="photo-upload" className="photo-upload-label">
                                Choose Photo
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="photo-input"
                            />
                            <p className="photo-help-text">Max: 1MB (JPG, PNG)</p>
                        </div>

                        <div className="form-fields">
                            <div className="field-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field-group date-field">
                                    <label>Date of Birth</label>
                                    <div className="date-picker-container">
                                        <DatePicker
                                            selected={formData.dateOfBirth}
                                            onChange={handleDateChange}
                                            dateFormat="MMMM d, yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            placeholderText="Select date of birth"
                                            maxDate={new Date()}
                                            yearDropdownItemNumber={100}
                                            className="date-input"
                                            required
                                        />
                                        {age && <span className="age-display">{age}</span>}
                                    </div>
                                </div>

                                <div className="field-group">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-group">
                                    <label>Class</label>
                                    <select name="class" value={formData.class} onChange={handleChange}>
                                        <option value="Toddler">Toddler</option>
                                        <option value="PreK-1">PreK-1</option>
                                        <option value="PreK-2">PreK-2</option>
                                        <option value="Kindergarten">Kindergarten</option>
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Parent Name</label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field-group">
                                    <label>Parent Email</label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        value={formData.parentEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Parent Phone</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field-group">
                                    <label>Allergies</label>
                                    <input
                                        type="text"
                                        name="medicalInfo.allergies"
                                        value={formData.medicalInfo.allergies.join(', ')}
                                        onChange={handleChange}
                                        placeholder="Separate with commas"
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Medications</label>
                                    <input
                                        type="text"
                                        name="medicalInfo.medications"
                                        value={formData.medicalInfo.medications.join(', ')}
                                        onChange={handleChange}
                                        placeholder="Separate with commas"
                                    />
                                </div>
                            </div>

                            <div className="field-group">
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