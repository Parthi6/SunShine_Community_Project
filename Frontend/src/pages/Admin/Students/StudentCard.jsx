import { useState } from 'react';
import StudentDetails from './StudentDetails';
import EditStudentForm from './EditStudentForm';
import './StudentCard.css';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from 'react-modal';

// Bind modal to your appElement
Modal.setAppElement('#root');

const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

const StudentCard = ({ student, onUpdate, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(
                `http://localhost:4000/api/v1/students/${student._id}`,
                { withCredentials: true }
            );
            toast.success('Student deleted successfully');
            onDelete(student._id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting student:', error);
            toast.error(error.response?.data?.message || 'Failed to delete student');
        }
    };

    return (
        <>
            <div className="student-card">
                <button 
                    className="delete-button"
                    onClick={handleDelete}
                    title="Delete Student"
                >
                    <FaTrash />
                </button>
                <div className="card-header">
                    <div className="student-avatar">
                        <img src={student.photo.url} alt={student.name} />
                    </div>
                    <div className="student-primary-info">
                        <h3>{student.name}</h3>
                        <span className="student-class">{student.class}</span>
                    </div>
                </div>

                <div className="card-content">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Age</span>
                            <span className="info-value">{calculateAge(student.dateOfBirth)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status</span>
                            <span className={`badge-status badge-${student.status.toLowerCase()}`} style={{ marginLeft: '-13px' }}>
                                {student.status}
                            </span>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Parent</span>
                            <span className="info-value">{student.parentName}</span>
                        </div>
                        <div className="info-item full-width">
                            <span className="info-label">Contact</span>
                            <span className="info-value phone-number">
                                {student.parentPhone}
                            </span>
                        </div>
                    </div>

                    <div className="card-actions">
                        <button 
                            className="card-btn edit-btn"
                            onClick={() => setShowEditForm(true)}
                        >
                            Edit Details
                        </button>
                        <button 
                            className="card-btn view-btn"
                            onClick={() => setShowDetails(true)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
                className="delete-modal"
                overlayClassName="delete-modal-overlay"
            >
                <div className="delete-modal-content">
                    <h2>Delete Student</h2>
                    <p>Are you sure you want to delete {student.name}?</p>
                    <p className="warning-text">This action cannot be undone.</p>
                    <div className="modal-buttons">
                        <button 
                            className="confirm-delete-btn"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                        <button 
                            className="cancel-btn"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {showDetails && (
                <StudentDetails 
                    student={student} 
                    onClose={() => setShowDetails(false)}
                />
            )}

            {showEditForm && (
                <EditStudentForm 
                    student={student}
                    onSubmit={onUpdate}
                    onClose={() => setShowEditForm(false)}
                />
            )}
        </>
    );
};

export default StudentCard; 