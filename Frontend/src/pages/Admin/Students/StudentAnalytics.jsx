const StudentAnalytics = ({ analytics }) => {
    return (
        <div className="analytics-section">
            <h2>Student Analytics</h2>
            <div className="analytics-grid">
                <div className="analytic-card">
                    <div className="analytic-number">{analytics.totalStudents}</div>
                    <div className="analytic-label">Total Students</div>
                </div>
                <div className="analytic-card">
                    <div className="analytic-number">{analytics.activeStudents}</div>
                    <div className="analytic-label">Active Students</div>
                </div>
                <div className="analytic-card">
                    <div className="analytic-number">
                        {analytics.byClass['Kindergarten'] || 0}
                    </div>
                    <div className="analytic-label">In Kindergarten</div>
                </div>
                <div className="analytic-card">
                    <div className="analytic-number">
                        {analytics.byGender['Male'] || 0}/{analytics.byGender['Female'] || 0}
                    </div>
                    <div className="analytic-label">Boys/Girls</div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics; 