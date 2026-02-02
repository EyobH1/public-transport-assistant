import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DelayReports.css';

const DelayReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    routeId: '',
    routeNumber: '',
    routeName: '',
    stopName: '',
    delayMinutes: 5,
    severity: 'medium',
    description: ''
  });

  useEffect(() => {
    fetchDelayReports();
  }, []);

  const fetchDelayReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delays?limit=20');
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching delay reports:', error);
      // Sample data for demo
      setReports([
        {
          _id: '1',
          routeNumber: '101',
          routeName: 'Downtown Express',
          delayMinutes: 15,
          severity: 'high',
          description: 'Heavy traffic on Main Street',
          stopName: 'Central Station',
          upvotes: 12,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          routeNumber: 'T1',
          routeName: 'Red Metro Line',
          delayMinutes: 5,
          severity: 'medium',
          description: 'Signal issues',
          stopName: 'Times Square',
          upvotes: 8,
          status: 'verified',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/delays/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Delay reported successfully!');
        setShowReportForm(false);
        fetchDelayReports();
        setFormData({
          routeId: '',
          routeNumber: '',
          routeName: '',
          stopName: '',
          delayMinutes: 5,
          severity: 'medium',
          description: ''
        });
      } else {
        alert('Failed to report delay: ' + data.error);
      }
    } catch (error) {
      console.error('Error reporting delay:', error);
      alert('Failed to report delay');
    }
  };

  const handleUpvote = async (reportId) => {
    try {
      // In a real app, get userId from auth context
      const userId = 'user123'; // Temporary
      
      const response = await fetch(`http://localhost:5000/api/delays/${reportId}/upvote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setReports(reports.map(report => 
          report._id === reportId 
            ? { ...report, upvotes: data.upvotes } 
            : report
        ));
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified': return { text: '✓ Verified', color: '#10b981' };
      case 'resolved': return { text: 'Resolved', color: '#3b82f6' };
      case 'false_report': return { text: 'False Report', color: '#6b7280' };
      default: return { text: 'Pending', color: '#f59e0b' };
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon spinner-large">⟳</div>
        <p>Loading delay reports...</p>
      </div>
    );
  }

  return (
    <div className="delay-reports-page">
      <div className="delay-reports-header">
        <div>
          <h1>Delay Reports</h1>
          <p className="subtitle">Real-time crowd-sourced delay information</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowReportForm(true)}
        >
          + Report Delay
        </button>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report a Delay</h2>
              <button 
                className="modal-close"
                onClick={() => setShowReportForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmitReport}>
              <div className="form-row">
                <div className="form-group">
                  <label>Route Number *</label>
                  <input
                    type="text"
                    value={formData.routeNumber}
                    onChange={(e) => setFormData({...formData, routeNumber: e.target.value})}
                    placeholder="e.g., 101, T1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Delay (minutes) *</label>
                  <select
                    value={formData.delayMinutes}
                    onChange={(e) => setFormData({...formData, delayMinutes: e.target.value})}
                    required
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30+ minutes</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Route Name</label>
                  <input
                    type="text"
                    value={formData.routeName}
                    onChange={(e) => setFormData({...formData, routeName: e.target.value})}
                    placeholder="e.g., Downtown Express"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stop Name</label>
                  <input
                    type="text"
                    value={formData.stopName}
                    onChange={(e) => setFormData({...formData, stopName: e.target.value})}
                    placeholder="e.g., Central Station"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Severity</label>
                <div className="severity-buttons">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      type="button"
                      className={`severity-btn ${formData.severity === level ? 'active' : ''}`}
                      style={{ backgroundColor: getSeverityColor(level) }}
                      onClick={() => setFormData({...formData, severity: level})}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What's causing the delay? (optional)"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowReportForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delay Stats */}
      <div className="delay-stats">
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{reports.length}</h3>
            <p>Active Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>{Math.round(reports.reduce((sum, r) => sum + r.delayMinutes, 0) / reports.length) || 0}</h3>
            <p>Avg. Delay</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👍</div>
          <div className="stat-info">
            <h3>{reports.reduce((sum, r) => sum + (r.upvotes || 0), 0)}</h3>
            <p>Total Upvotes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <h3>{reports.filter(r => r.status === 'verified').length}</h3>
            <p>Verified</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Filter by Severity:</label>
          <div className="filter-tags">
            {['all', 'high', 'medium', 'low'].map(severity => (
              <button key={severity} className="filter-tag">
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select className="sort-select">
            <option>Most Recent</option>
            <option>Most Upvoted</option>
            <option>Longest Delay</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-list">
        {reports.length > 0 ? (
          reports.map(report => {
            const statusBadge = getStatusBadge(report.status);
            
            return (
              <div key={report._id} className="report-card">
                <div className="report-header">
                  <div className="report-route">
                    <div className="route-badge">{report.routeNumber}</div>
                    <div>
                      <h3>{report.routeName}</h3>
                      <p className="report-stop">
                        <span className="stop-icon">📍</span>
                        {report.stopName || 'Various stops'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="report-meta">
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(report.severity) }}
                    >
                      {report.delayMinutes} min delay
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: statusBadge.color }}
                    >
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {report.description && (
                  <div className="report-description">
                    <p>{report.description}</p>
                  </div>
                )}

                <div className="report-footer">
                  <div className="report-actions">
                    <button 
                      className="btn-upvote"
                      onClick={() => handleUpvote(report._id)}
                    >
                      <span className="upvote-icon">👍</span>
                      Upvote ({report.upvotes || 0})
                    </button>
                    <button className="btn-comment">
                      <span className="comment-icon">💬</span>
                      Comment
                    </button>
                    <button className="btn-share">
                      <span className="share-icon">📤</span>
                      Share
                    </button>
                  </div>
                  
                  <div className="report-time">
                    Reported {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-reports">
            <div className="no-reports-icon">📭</div>
            <h3>No delay reports yet</h3>
            <p>Be the first to report a delay in your area!</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowReportForm(true)}
            >
              Report First Delay
            </button>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h3>🚨 Reporting Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Be Specific</h4>
            <p>Include route numbers, stop names, and exact delay times</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <h4>Verify First</h4>
            <p>Check if someone already reported the same delay</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">✅</div>
            <h4>Update Status</h4>
            <p>Mark as resolved when delays clear</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">👍</div>
            <h4>Upvote Helpful</h4>
            <p>Upvote accurate reports to help others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelayReports;