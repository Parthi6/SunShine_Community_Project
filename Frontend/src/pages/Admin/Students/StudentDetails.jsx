import './StudentDetails.css';

const StudentDetails = ({ student, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Student Details</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="student-details-content">
                    <div className="student-photo-large">
                        <img src={student.photo.url} alt={student.name} />
                    </div>
                    
                    <div className="details-grid">
                        <div className="detail-group">
                            <label>Name</label>
                            <p>{student.name}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Class</label>
                            <p>{student.class}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Date of Birth</label>
                            <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Status</label>
                            <p className={`status-${student.status.toLowerCase()}`}>
                                {student.status}
                            </p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Parent Name</label>
                            <p>{student.parentName}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Parent Email</label>
                            <p>{student.parentEmail}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Parent Phone</label>
                            <p>{student.parentPhone}</p>
                        </div>
                        
                        <div className="detail-group full-width">
                            <label>Address</label>
                            <p>{student.address}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Allergies</label>
                            <p>{student.medicalInfo.allergies.join(', ') || 'None'}</p>
                        </div>
                        
                        <div className="detail-group">
                            <label>Medications</label>
                            <p>{student.medicalInfo.medications.join(', ') || 'None'}</p>
                        </div>
                        
                        <div className="detail-group full-width">
                            <label>Special Needs</label>
                            <p>{student.medicalInfo.specialNeeds || 'None'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails; 