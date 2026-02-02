import React from 'react';
import './AdminPages.css';

const DelayManagement = () => {
  return (
    <div className="admin-page">
      <h1>Delay Management</h1>
      <p className="subtitle">Admin panel for moderating delay reports</p>
      
      <div className="admin-content">
        <div className="admin-card">
          <h2>⚠️ Manage Delay Reports</h2>
          <p>This feature is under development.</p>
          <p>Here you will be able to:</p>
          <ul>
            <li>View all delay reports</li>
            <li>Verify reports</li>
            <li>Mark reports as resolved</li>
            <li>Filter false reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DelayManagement;