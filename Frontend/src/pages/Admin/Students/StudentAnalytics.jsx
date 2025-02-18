const StudentAnalytics = ({ analytics }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="analytics-section">
            <div className="analytics-header">
                <h2>Student Analytics</h2>
                <span className="current-date">{currentDate}</span>
            </div>
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