import React, { useState, useEffect } from 'react';
import './AdminPages.css';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  
  const [formData, setFormData] = useState({
    routeNumber: '',
    name: '',
    transportType: 'bus',
    stops: [{ name: '', location: { lat: '', lng: '' } }],
    schedule: [{ day: 'weekday', times: [''] }]
  });

  useEffect(() => {
    // Fetch routes from API
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const data = await response.json();
      if (data.success) {
        setRoutes(data.routes);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Sample data for demo
      setRoutes([
        {
          _id: '1',
          routeNumber: '101',
          name: 'Downtown Express',
          transportType: 'bus',
          stops: [
            { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 } },
            { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 } }
          ],
          schedule: [{ day: 'weekday', times: ['07:00', '08:00'] }]
        },
        {
          _id: '2',
          routeNumber: 'T1',
          name: 'Red Metro Line',
          transportType: 'train',
          stops: [
            { name: 'North Terminal', location: { lat: 40.7500, lng: -73.9900 } },
            { name: 'Times Square', location: { lat: 40.7580, lng: -73.9850 } }
          ],
          schedule: [{ day: 'all', times: ['06:00', '07:00'] }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // API call to add/edit route
      alert(editingRoute ? 'Route updated!' : 'Route added!');
      setShowAddForm(false);
      setEditingRoute(null);
      fetchRoutes();
      
      // Reset form
      setFormData({
        routeNumber: '',
        name: '',
        transportType: 'bus',
        stops: [{ name: '', location: { lat: '', lng: '' } }],
        schedule: [{ day: 'weekday', times: [''] }]
      });
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      routeNumber: route.routeNumber,
      name: route.name,
      transportType: route.transportType,
      stops: route.stops,
      schedule: route.schedule
    });
    setShowAddForm(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        // API call to delete
        alert('Route deleted!');
        fetchRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Failed to delete route');
      }
    }
  };

  const addStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { name: '', location: { lat: '', lng: '' } }]
    });
  };

  const removeStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: newStops });
  };

  const updateStop = (index, field, value) => {
    const newStops = [...formData.stops];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newStops[index][parent][child] = value;
    } else {
      newStops[index][field] = value;
    }
    setFormData({ ...formData, stops: newStops });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">
          <div className="spinner-icon spinner-large">⟳</div>
          <p>Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Route Management</h1>
          <p className="subtitle">Manage all transport routes in the system</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingRoute(null);
            setShowAddForm(true);
          }}
        >
          + Add New Route
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingRoute ? 'Edit Route' : 'Add New Route'}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingRoute(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
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
                  <label>Transport Type *</label>
                  <select
                    value={formData.transportType}
                    onChange={(e) => setFormData({...formData, transportType: e.target.value})}
                    required
                  >
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="tram">Tram</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Route Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Downtown Express"
                  required
                />
              </div>

              <div className="form-section">
                <h3>Stops</h3>
                {formData.stops.map((stop, index) => (
                  <div key={index} className="stop-row">
                    <div className="form-group">
                      <label>Stop Name</label>
                      <input
                        type="text"
                        value={stop.name}
                        onChange={(e) => updateStop(index, 'name', e.target.value)}
                        placeholder="e.g., Central Station"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={stop.location.lat}
                        onChange={(e) => updateStop(index, 'location.lat', e.target.value)}
                        placeholder="40.7128"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={stop.location.lng}
                        onChange={(e) => updateStop(index, 'location.lng', e.target.value)}
                        placeholder="-74.0060"
                      />
                    </div>
                    
                    {formData.stops.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeStop(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addStop}
                >
                  + Add Another Stop
                </button>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRoute(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoute ? 'Update Route' : 'Add Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="routes-table-container">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">Route #</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Type</div>
            <div className="table-cell">Stops</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {routes.length > 0 ? (
            routes.map(route => (
              <div key={route._id} className="table-row">
                <div className="table-cell">
                  <span className="route-badge-cell">{route.routeNumber}</span>
                </div>
                <div className="table-cell">
                  <strong>{route.name}</strong>
                </div>
                <div className="table-cell">
                  <span className={`type-badge ${route.transportType}`}>
                    {route.transportType}
                  </span>
                </div>
                <div className="table-cell">
                  {route.stops?.length || 0} stops
                </div>
                <div className="table-cell">
                  <span className="status-badge active">Active</span>
                </div>
                <div className="table-cell actions-cell">
                  <button 
                    className="btn-action edit"
                    onClick={() => handleEdit(route)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-action delete"
                    onClick={() => handleDelete(route._id)}
                  >
                    Delete
                  </button>
                  <button className="btn-action view">
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="table-cell" colSpan="6">
                <div className="no-data">
                  <p>No routes found. Add your first route!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-info">
            <h3>{routes.length}</h3>
            <p>Total Routes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-info">
            <h3>{routes.reduce((sum, route) => sum + (route.stops?.length || 0), 0)}</h3>
            <p>Total Stops</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>24/7</h3>
            <p>Service Hours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>100%</h3>
            <p>Coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RouteManagement;