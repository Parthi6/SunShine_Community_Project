import { useState } from 'react';
import StudentDetails from './StudentDetails';
import EditStudentForm from './EditStudentForm';
import './StudentCard.css';

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

const StudentCard = ({ student, onUpdate }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    return (
        <>
            <div className="student-card">
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
                            <span className={`status-badge status-${student.status.toLowerCase()}`}>
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
                            className="card-btn view-btn"
                            onClick={() => setShowDetails(true)}
                        >
                            View Details
                        </button>
                        <button 
                            className="card-btn edit-btn"
                            onClick={() => setShowEditForm(true)}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>

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