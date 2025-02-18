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
    const [showEdit, setShowEdit] = useState(false);

    return (
        <>
            <div className="student-card">
                <div className="student-photo">
                    <img src={student.photo.url} alt={student.name} />
                </div>
                <div className="student-info">
                    <h3>{student.name}</h3>
                    <p className="student-class">{student.class}</p>
                    <div className="student-details">
                        <p><strong>Age:</strong> {calculateAge(student.dateOfBirth)}</p>
                        <p><strong>Parent:</strong> {student.parentName}</p>
                        <p><strong>Status:</strong> 
                            <span className={`status-${student.status.toLowerCase()}`}>
                                {student.status}
                            </span>
                        </p>
                    </div>
                    <div className="card-actions">
                        <button 
                            className="view-btn"
                            onClick={() => setShowDetails(true)}
                        >
                            View Details
                        </button>
                        <button 
                            className="edit-btn"
                            onClick={() => setShowEdit(true)}
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

            {showEdit && (
                <EditStudentForm 
                    student={student}
                    onSubmit={onUpdate}
                    onClose={() => setShowEdit(false)}
                />
            )}
        </>
    );
};

export default StudentCard; 