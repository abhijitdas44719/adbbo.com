import React, { useState, useEffect } from 'react'
import './Home.css'
import { useBusContext } from '../context/BusContext'

function Home() {
  const { buses } = useBusContext();

  const stats = {
    activeBuses: buses.filter(bus => bus.status === 'active').length,
    todayBookings: buses.reduce((acc, bus) => 
      acc + bus.seats.filter(seat => seat.status === 'booked').length, 0
    ),
    revenue: buses.reduce((acc, bus) => 
      acc + (bus.seats.filter(seat => seat.status === 'booked').length * 1000), 0
    ),
    activeRoutes: [...new Set(buses.map(bus => bus.route))].length
  };

  // Activities state
  const [activities, setActivities] = useState([
    { time: '09:45 AM', message: 'New booking received for Route #123' },
    { time: '09:30 AM', message: 'Bus BUS-001 started journey from Station A' },
    { time: '09:15 AM', message: 'Schedule updated for Weekend Routes' }
  ]);

  // Action handlers
  const handleAddRoute = () => {
    setStats(prev => ({
      ...prev,
      activeRoutes: prev.activeRoutes + 1
    }));
    addActivity('Added new route to the system');
  };

  const handleUpdateSchedule = () => {
    addActivity('Schedule update initiated');
  };

  const handleViewBookings = () => {
    addActivity('Accessed booking information');
  };

  const handleManageFleet = () => {
    addActivity('Accessed fleet management');
  };

  // Helper function to add new activity
  const addActivity = (message) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setActivities(prev => [{
      time: timeString,
      message: message
    }, ...prev.slice(0, 4)]);
  };

  // Mock data update every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayBookings: prev.todayBookings + Math.floor(Math.random() * 3),
        revenue: prev.revenue + Math.floor(Math.random() * 100)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="welcome-banner">
        <h1>Welcome to ADIBUS (Indian) Bus Operations Management</h1>
        <p>Your complete interstate bus operation management solution</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Active Buses</h3>
          <p className="stat-number">{stats.activeBuses}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Bookings</h3>
          <p className="stat-number">{stats.todayBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">₹{stats.revenue}</p>
        </div>
        <div className="stat-card">
          <h3>Active Routes</h3>
          <p className="stat-number">{stats.activeRoutes}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-panel">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={handleAddRoute}>Add New Route</button>
          <button className="action-btn" onClick={handleUpdateSchedule}>Update Schedule</button>
          <button className="action-btn" onClick={handleViewBookings}>View Bookings</button>
          <button className="action-btn" onClick={handleManageFleet}>Manage Fleet</button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="time">{activity.time}</span>
              <p>{activity.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
