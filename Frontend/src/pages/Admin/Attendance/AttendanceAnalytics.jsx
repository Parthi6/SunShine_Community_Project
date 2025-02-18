import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';

const AttendanceAnalytics = ({ selectedDate, selectedClass, updateTrigger }) => {
    const [expandedCharts, setExpandedCharts] = useState({
        trends: false,
        classwise: false
    });
    const [weeklyData, setWeeklyData] = useState([]);
    const [classwiseData, setClasswiseData] = useState({
        present: [],
        absent: []
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedDate, selectedClass, updateTrigger]);

    const fetchAnalyticsData = async () => {
        try {
            // Format the date for API calls
            const formattedDate = selectedDate.toISOString().split('T')[0];

            // Fetch weekly trend data
            const weeklyResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/analytics/weekly?date=${formattedDate}`,
                { withCredentials: true }
            );
            setWeeklyData(weeklyResponse.data.weeklyTrend);

            // Fetch class-wise data
            const classwiseResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/analytics/classwise?date=${formattedDate}${
                    selectedClass !== 'all' ? `&class=${selectedClass}` : ''
                }`,
                { withCredentials: true }
            );
            setClasswiseData(classwiseResponse.data.classwiseData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const lineChartData = {
        labels: weeklyData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }),
        datasets: [
            {
                label: 'Attendance Rate',
                data: weeklyData.map(item => Number(item.attendanceRate.toFixed(1))),
                fill: false,
                borderColor: '#4ecdc4',
                tension: 0.1
            }
        ]
    };

    const barChartData = {
        labels: ['Toddler', 'PreK-1', 'PreK-2', 'Kindergarten'],
        datasets: [
            {
                label: 'Present',
                data: classwiseData.present,
                backgroundColor: '#4ecdc4'
            },
            {
                label: 'Absent',
                data: classwiseData.absent,
                backgroundColor: '#ff6b6b'
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Weekly Attendance Trend'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Attendance: ${context.parsed.y.toFixed(1)}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                    stepSize: 20
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Class-wise Attendance'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 5
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const toggleChart = (chart) => {
        setExpandedCharts(prev => ({
            ...prev,
            [chart]: !prev[chart]
        }));
    };

    return (
        <div className="analytics-container">
            <div className={`chart-wrapper ${expandedCharts.trends ? 'expanded' : ''}`}>
                <div className="chart-header" onClick={() => toggleChart('trends')}>
                    <h3>Attendance Trends</h3>
                    <button className="expand-btn">
                        {expandedCharts.trends ? '−' : '+'}
                    </button>
                </div>
                <div className={`chart-content ${expandedCharts.trends ? 'show' : ''}`}>
                    <div className="chart-container">
                        <Line 
                            data={lineChartData} 
                            options={{
                                ...lineChartOptions,
                                maintainAspectRatio: false
                            }} 
                        />
                    </div>
                </div>
            </div>

            <div className={`chart-wrapper ${expandedCharts.classwise ? 'expanded' : ''}`}>
                <div className="chart-header" onClick={() => toggleChart('classwise')}>
                    <h3>Class-wise Attendance</h3>
                    <button className="expand-btn">
                        {expandedCharts.classwise ? '−' : '+'}
                    </button>
                </div>
                <div className={`chart-content ${expandedCharts.classwise ? 'show' : ''}`}>
                    <div className="chart-container">
                        <Bar 
                            data={barChartData} 
                            options={{
                                ...barChartOptions,
                                maintainAspectRatio: false
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceAnalytics; 