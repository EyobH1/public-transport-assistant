import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RouteAnalytics = ({ data }) => {
  // Route Popularity Chart
  const popularityData = {
    labels: data.popularRoutes?.map(route => route.routeNumber) || [],
    datasets: [
      {
        label: 'Number of Trips',
        data: data.popularRoutes?.map(route => route.tripCount) || [],
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
          '#06b6d4', '#ec4899', '#f97316', '#6366f1', '#14b8a6'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const popularityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Most Popular Routes',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Trips',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Route Number',
        },
      },
    },
  };

  // Delay Analysis Chart
  const delayData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Average Delay (minutes)',
        data: data.delayTrends || [15, 12, 18, 20, 25, 8, 10],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Number of Reports',
        data: data.reportTrends || [24, 20, 28, 32, 40, 15, 18],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const delayOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Delay Trends',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes / Reports',
        },
      },
    },
  };

  // Transport Type Distribution
  const transportData = {
    labels: ['Bus', 'Train', 'Tram'],
    datasets: [
      {
        label: 'Routes by Type',
        data: data.transportDistribution || [65, 25, 10],
        backgroundColor: [
          '#10b981', // Bus - green
          '#ef4444', // Train - red
          '#8b5cf6', // Tram - purple
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const transportOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Transport Type Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  // Peak Hours Chart
  const peakHoursData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
    datasets: [
      {
        label: 'Passenger Volume',
        data: data.peakHours || [120, 450, 280, 320, 240, 380, 420, 280, 150],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 2,
      },
    ],
  };

  const peakHoursOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Peak Hours Analysis',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Passengers',
        },
      },
    },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>🚍 Transport Analytics Dashboard</h2>
        <p className="subtitle">Real-time insights and performance metrics</p>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="metrics-summary">
          <div className="metric-card">
            <div className="metric-icon">🚌</div>
            <div className="metric-info">
              <h3>{data.totalRoutes || 24}</h3>
              <p>Active Routes</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-info">
              <h3>{data.totalPassengers || '1,240'}</h3>
              <p>Daily Passengers</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-info">
              <h3>{data.avgDelay || 12}</h3>
              <p>Avg. Delay (min)</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <h3>{data.onTimeRate || '89%'}</h3>
              <p>On-time Rate</p>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Route Popularity</h3>
              <span className="chart-subtitle">Most frequently used routes</span>
            </div>
            <div className="chart-container">
              <Bar data={popularityData} options={popularityOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Delay Trends</h3>
              <span className="chart-subtitle">Weekly delay patterns</span>
            </div>
            <div className="chart-container">
              <Line data={delayData} options={delayOptions} />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="chart-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Transport Distribution</h3>
              <span className="chart-subtitle">Breakdown by vehicle type</span>
            </div>
            <div className="chart-container">
              <Doughnut data={transportData} options={transportOptions} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Peak Hours</h3>
              <span className="chart-subtitle">Passenger volume by time</span>
            </div>
            <div className="chart-container">
              <Bar data={peakHoursData} options={peakHoursOptions} />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="stats-grid">
          <div className="stats-card">
            <h4>🚨 Top Delay Routes</h4>
            <ul className="stats-list">
              {data.topDelayedRoutes?.map((route, index) => (
                <li key={index}>
                  <span className="route-badge">{route.routeNumber}</span>
                  <span className="route-name">{route.name}</span>
                  <span className="delay-count">{route.delayCount} reports</span>
                </li>
              )) || (
                <>
                  <li>
                    <span className="route-badge">101</span>
                    <span className="route-name">Downtown Express</span>
                    <span className="delay-count">24 reports</span>
                  </li>
                  <li>
                    <span className="route-badge">T1</span>
                    <span className="route-name">Red Metro Line</span>
                    <span className="delay-count">18 reports</span>
                  </li>
                  <li>
                    <span className="route-badge">202</span>
                    <span className="route-name">University Line</span>
                    <span className="delay-count">12 reports</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="stats-card">
            <h4>⭐ User Satisfaction</h4>
            <div className="satisfaction-meter">
              <div className="meter-label">Overall Rating</div>
              <div className="meter-value">4.2/5.0</div>
              <div className="meter-bar">
                <div className="meter-fill" style={{ width: '84%' }}></div>
              </div>
              <div className="meter-stats">
                <div className="stat-item">
                  <span className="stat-label">Punctuality</span>
                  <span className="stat-value">3.8</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Cleanliness</span>
                  <span className="stat-value">4.5</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Comfort</span>
                  <span className="stat-value">4.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <h4>📊 Performance Metrics</h4>
            <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">Route Coverage</span>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ width: '92%' }}>
                    <span className="progress-text">92%</span>
                  </div>
                </div>
              </div>
              <div className="metric-item">
                <span className="metric-label">Schedule Adherence</span>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ width: '89%' }}>
                    <span className="progress-text">89%</span>
                  </div>
                </div>
              </div>
              <div className="metric-item">
                <span className="metric-label">Report Resolution</span>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ width: '95%' }}>
                    <span className="progress-text">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="time-selector">
        <h4>Time Range</h4>
        <div className="time-buttons">
          {['Today', 'Week', 'Month', 'Quarter', 'Year'].map((range) => (
            <button key={range} className="time-button">
              {range}
            </button>
          ))}
        </div>
        <div className="export-actions">
          <button className="btn btn-secondary">
            📥 Export Data (CSV)
          </button>
          <button className="btn btn-primary">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};
export default RouteAnalytics;