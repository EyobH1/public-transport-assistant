import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix for default icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/984/984173.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const trainIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/984/984172.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const tramIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/984/984174.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const MapView = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([40.7128, -74.0060]); // NYC default
  const [zoom, setZoom] = useState(12);

  // Fetch routes from backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/routes');
        const data = await response.json();
        if (data.success) {
          setRoutes(data.routes);
          
          // Calculate center of all routes
          if (data.routes.length > 0) {
            const validRoutes = data.routes.filter(route => 
              route.stops && route.stops.length > 0 && 
              route.stops[0].location
            );
            
            if (validRoutes.length > 0) {
              const avgLat = validRoutes.reduce((sum, route) => 
                sum + route.stops[0].location.lat, 0) / validRoutes.length;
              const avgLng = validRoutes.reduce((sum, route) => 
                sum + route.stops[0].location.lng, 0) / validRoutes.length;
              
              setCenter([avgLat, avgLng]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        // Fallback to sample data
        setRoutes([
          {
            _id: '1',
            routeNumber: '101',
            name: 'Downtown Express',
            transportType: 'bus',
            stops: [
              { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 } },
              { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 } },
              { name: 'Financial District', location: { lat: 40.7075, lng: -74.0113 } }
            ],
            schedule: [{ day: 'weekday', times: ['07:00', '08:00'] }]
          },
          {
            _id: '2',
            routeNumber: '202',
            name: 'University Line',
            transportType: 'bus',
            stops: [
              { name: 'University Campus', location: { lat: 40.8075, lng: -73.9626 } },
              { name: 'Student Union', location: { lat: 40.8080, lng: -73.9630 } },
              { name: 'Library', location: { lat: 40.8100, lng: -73.9650 } }
            ],
            schedule: [{ day: 'all', times: ['06:30', '07:30'] }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getRouteColor = (transportType) => {
    switch(transportType) {
      case 'bus': return '#10b981';
      case 'train': return '#ef4444';
      case 'tram': return '#8b5cf6';
      default: return '#3b82f6';
    }
  };

  const getIcon = (transportType) => {
    switch(transportType) {
      case 'bus': return busIcon;
      case 'train': return trainIcon;
      case 'tram': return tramIcon;
      default: return busIcon;
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon spinner-large">⟳</div>
        <p>Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="map-view-page">
      <div className="map-sidebar">
        <h2>🚍 Transport Map</h2>
        <p className="subtitle">View all routes and stops in your area</p>
        
        <div className="map-controls">
          <div className="legend">
            <h4>Legend</h4>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Bus Routes</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Train Routes</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span>Tram Routes</span>
            </div>
          </div>

          <div className="route-list">
            <h4>Available Routes ({routes.length})</h4>
            <div className="route-list-scroll">
              {routes.map(route => (
                <div 
                  key={route._id}
                  className={`route-item ${selectedRoute?._id === route._id ? 'active' : ''}`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="route-item-badge" style={{ 
                    backgroundColor: getRouteColor(route.transportType) 
                  }}>
                    {route.routeNumber}
                  </div>
                  <div className="route-item-info">
                    <h5>{route.name}</h5>
                    <p>{route.transportType} • {route.stops?.length || 0} stops</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedRoute && (
            <div className="selected-route-info">
              <h4>Selected Route</h4>
              <div className="selected-route-card">
                <div className="route-header">
                  <span className="route-badge" style={{ 
                    backgroundColor: getRouteColor(selectedRoute.transportType) 
                  }}>
                    {selectedRoute.routeNumber}
                  </span>
                  <h3>{selectedRoute.name}</h3>
                </div>
                <p className="route-type">{selectedRoute.transportType}</p>
                
                <div className="route-stops">
                  <h5>Stops:</h5>
                  <ul>
                    {selectedRoute.stops?.map((stop, index) => (
                      <li key={index}>
                        <span className="stop-number">{index + 1}</span>
                        <span className="stop-name">{stop.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = `/routes/${selectedRoute._id}`}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="map-container">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          className="leaflet-map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Draw all routes */}
          {routes.map(route => {
            if (!route.stops || route.stops.length < 2) return null;
            
            const positions = route.stops
              .filter(stop => stop.location)
              .map(stop => [stop.location.lat, stop.location.lng]);
            
            return (
              <div key={route._id}>
                <Polyline
                  pathOptions={{
                    color: getRouteColor(route.transportType),
                    weight: 4,
                    opacity: 0.7
                  }}
                  positions={positions}
                  eventHandlers={{
                    click: () => setSelectedRoute(route)
                  }}
                />
                
                {/* Markers for stops */}
                {route.stops.map((stop, index) => (
                  stop.location && (
                    <Marker
                      key={index}
                      position={[stop.location.lat, stop.location.lng]}
                      icon={getIcon(route.transportType)}
                      eventHandlers={{
                        click: () => console.log('Stop clicked:', stop.name)
                      }}
                    >
                      <Popup>
                        <div className="stop-popup">
                          <h4>{stop.name}</h4>
                          <p><strong>Route:</strong> {route.routeNumber} - {route.name}</p>
                          <p><strong>Type:</strong> {route.transportType}</p>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => window.location.href = `/routes/${route._id}`}
                          >
                            View Route
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;