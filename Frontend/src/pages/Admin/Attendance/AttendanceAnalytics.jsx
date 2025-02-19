import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

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
    const [pieChartData, setPieChartData] = useState({
        labels: ['Present', 'Late', 'Absent'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
            borderColor: ['#27ae60', '#f39c12', '#c0392b'],
            borderWidth: 1
        }]
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedDate, selectedClass, updateTrigger]);

    const fetchAnalyticsData = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];

            // Get all students and attendance data
            const studentsResponse = await axios.get(
                'http://localhost:4000/api/v1/students',
                { withCredentials: true }
            );

            const attendanceResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/by-date/${formattedDate}`,
                { withCredentials: true }
            );

            // Filter active students based on selected class
            let activeStudents = studentsResponse.data.students.filter(
                student => student.status === 'Active'
            );

            if (selectedClass !== 'all') {
                activeStudents = activeStudents.filter(
                    student => student.class === selectedClass
                );
            }

            // Create attendance map
            const attendanceMap = new Map(
                attendanceResponse.data.attendance
                    .filter(record => record && record.student)
                    .map(record => [record.student._id, record.status])
            );

            // Calculate present, late, and absent counts
            const attendanceCounts = activeStudents.reduce(
                (acc, student) => {
                    const status = attendanceMap.get(student._id)?.toLowerCase() || 'absent';
                    if (status === 'present') {
                        acc.present++;
                    } else if (status === 'late') {
                        acc.late++;
                    } else {
                        acc.absent++;
                    }
                    return acc;
                },
                { present: 0, late: 0, absent: 0 }
            );

            // Update pie chart data with late status
            setPieChartData({
                labels: ['Present', 'Late', 'Absent'],
                datasets: [{
                    data: [
                        attendanceCounts.present,
                        attendanceCounts.late,
                        attendanceCounts.absent
                    ],
                    backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
                    borderColor: ['#27ae60', '#f39c12', '#c0392b'],
                    borderWidth: 1
                }]
            });

            // Update weekly trends API call to include class filter
            const weeklyResponse = await axios.get(
                `http://localhost:4000/api/v1/attendances/analytics/weekly?date=${formattedDate}${
                    selectedClass !== 'all' ? `&class=${selectedClass}` : ''
                }`,
                { withCredentials: true }
            );
            setWeeklyData(weeklyResponse.data.weeklyTrend);

            // Class-wise data API call (already has class filter)
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
                label: selectedClass === 'all' ? 'Overall Attendance Rate' : `${selectedClass} Attendance Rate`,
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
                text: selectedClass === 'all' 
                    ? 'Weekly Attendance Trend (All Classes)' 
                    : `Weekly Attendance Trend (${selectedClass})`
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

    const pieChartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
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
                    <h3>Daily Attendance Rate</h3>
                    <button className="expand-btn">
                        {expandedCharts.classwise ? '−' : '+'}
                    </button>
                </div>
                <div className={`chart-content ${expandedCharts.classwise ? 'show' : ''}`}>
                    <div className="chart-container">
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceAnalytics; 