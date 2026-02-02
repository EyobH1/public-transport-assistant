import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './AdminPages.css';

const DelayManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'pending',
    severity: 'all',
    dateRange: 'today'
  });
  const [selectedReports, setSelectedReports] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/delays', {
        params: filters
      });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/delays/${reportId}/verify`);
      setReports(prev => 
        prev.map(r => r._id === reportId ? { ...r, status: 'verified', verifiedBy: user.id } : r)
      );
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/delays/${reportId}/resolve`);
      setReports(prev => 
        prev.map(r => r._id === reportId ? { ...r, status: 'resolved' } : r)
      );
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleReject = async (reportId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/delays/${reportId}/reject`);
      setReports(prev => 
        prev.map(r => r._id === reportId ? { ...r, status: 'false_report' } : r)
      );
    } catch (error) {
      console.error('Error rejecting report:', error);
    }
  };

  const bulkAction = async (action) => {
    if (selectedReports.length === 0) return;
    
    try {
      await axios.post('http://localhost:5000/api/admin/delays/bulk-action', {
        reportIds: selectedReports,
        action
      });
      
      // Update local state
      setReports(prev => prev.map(r => 
        selectedReports.includes(r._id) 
          ? { ...r, status: action === 'verify' ? 'verified' : 
                     action === 'resolve' ? 'resolved' : 'false_report' }
          : r
      ));
      setSelectedReports([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return '#10b981';
      case 'resolved': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'false_report': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Delay Management</h1>
          <p className="subtitle">Review and manage crowd-sourced delay reports</p>
        </div>
        
        <div className="admin-actions">
          <button 
            className="btn btn-primary"
            onClick={() => bulkAction('verify')}
            disabled={selectedReports.length === 0}
          >
            ✓ Verify Selected
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => bulkAction('resolve')}
            disabled={selectedReports.length === 0}
          >
            ✅ Resolve Selected
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => bulkAction('reject')}
            disabled={selectedReports.length === 0}
          >
            ✗ Reject Selected
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
            <option value="false_report">False Reports</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Severity</label>
          <select 
            value={filters.severity}
            onChange={(e) => setFilters({...filters, severity: e.target.value})}
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Date Range</label>
          <select 
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{reports.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-info">
            <h3>{reports.filter(r => r.status === 'verified').length}</h3>
            <p>Verified</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{reports.filter(r => r.status === 'resolved').length}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✗</div>
          <div className="stat-info">
            <h3>{reports.filter(r => r.status === 'false_report').length}</h3>
            <p>False Reports</p>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  checked={selectedReports.length === reports.length && reports.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedReports(reports.map(r => r._id));
                    } else {
                      setSelectedReports([]);
                    }
                  }}
                />
              </th>
              <th>Route</th>
              <th>Delay</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedReports.includes(report._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports([...selectedReports, report._id]);
                      } else {
                        setSelectedReports(selectedReports.filter(id => id !== report._id));
                      }
                    }}
                  />
                </td>
                <td>
                  <div className="route-cell">
                    <span className="route-badge">{report.routeNumber}</span>
                    <span>{report.routeName}</span>
                  </div>
                </td>
                <td>{report.delayMinutes} minutes</td>
                <td>
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(report.severity) }}
                  >
                    {report.severity}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(report.status) }}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {report.status === 'pending' && (
                      <>
                        <button 
                          className="btn-action verify"
                          onClick={() => handleVerify(report._id)}
                        >
                          Verify
                        </button>
                        <button 
                          className="btn-action resolve"
                          onClick={() => handleResolve(report._id)}
                        >
                          Resolve
                        </button>
                        <button 
                          className="btn-action reject"
                          onClick={() => handleReject(report._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {report.status === 'verified' && (
                      <button 
                        className="btn-action resolve"
                        onClick={() => handleResolve(report._id)}
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button 
                      className="btn-action view"
                      onClick={() => window.open(`/routes/${report.routeId}`, '_blank')}
                    >
                      View Route
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {reports.length === 0 && !loading && (
          <div className="no-data">
            <p>No delay reports found with current filters</p>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h3>Delay Analytics</h3>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>Most Delayed Routes</h4>
            <ul>
              {reports
                .reduce((acc, report) => {
                  const route = acc.find(r => r.routeNumber === report.routeNumber);
                  if (route) {
                    route.count++;
                  } else {
                    acc.push({ routeNumber: report.routeNumber, count: 1 });
                  }
                  return acc;
                }, [])
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((route, i) => (
                  <li key={i}>
                    <span>{route.routeNumber}</span>
                    <span>{route.count} reports</span>
                  </li>
                ))}
            </ul>
          </div>
          
          <div className="analytics-card">
            <h4>Peak Report Times</h4>
            {/* Add Chart.js component here */}
            <p>Chart showing report frequency by hour</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DelayManagement;