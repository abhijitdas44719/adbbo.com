import React, { useState } from 'react'
import './BusManage.css'
import { useBusContext } from '../context/BusContext'
import axios from 'axios'
import { useEffect } from 'react';

function BusManage() {
  const { buses, setBuses } = useBusContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBus, setNewBus] = useState({
    number: '',
    route: '',
    capacity: '',
    status: 'active'
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);

  // Fetch buses from backend
  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/buses');
      setBuses(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setError('Failed to fetch buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/buses', {
        ...newBus,
        capacity: parseInt(newBus.capacity)
      });
      
      setBuses([...buses, response.data]);
      setNewBus({ number: '', route: '', capacity: '', status: 'active' });
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error('Error adding bus:', error);
      setError(error.response?.data?.message || 'Failed to add bus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/api/buses/${id}/status`, { status: newStatus });
      setBuses(buses.map(bus => 
        bus._id === id ? response.data : bus
      ));
      setError(null);
    } catch (error) {
      console.error('Error updating bus status:', error);
      setError('Failed to update bus status. Please try again.');
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bus?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/buses/${id}`);
      setBuses(buses.filter(bus => bus._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting bus:', error);
      setError('Failed to delete bus. Please try again.');
    }
  };

  const handleSeatStatusChange = async (busId, seatIndex, newStatus) => {
    try {
      const response = await axios.patch(`/api/buses/${busId}/seats/${seatIndex}`, { 
        status: newStatus 
      });
      
      setBuses(buses.map(bus => 
        bus._id === busId ? response.data : bus
      ));
      
      // Update selected bus for modal
      if (selectedBus && selectedBus._id === busId) {
        setSelectedBus(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error updating seat status:', error);
      setError('Failed to update seat status. Please try again.');
    }
  };

  const handleDepartureTimeChange = async (busId, newTime) => {
    try {
      const response = await axios.patch(`/api/buses/${busId}/departure`, { 
        departureTime: newTime 
      });
      
      setBuses(buses.map(bus => 
        bus._id === busId ? response.data : bus
      ));
      
      if (selectedBus && selectedBus._id === busId) {
        setSelectedBus(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error updating departure time:', error);
      setError('Failed to update departure time. Please try again.');
    }
  };

  const handleStopBookingChange = async (busId, minutes) => {
    try {
      const response = await axios.patch(`/api/buses/${busId}/booking-cutoff`, { 
        stopBookingBefore: parseInt(minutes) 
      });
      
      setBuses(buses.map(bus => 
        bus._id === busId ? response.data : bus
      ));
      
      if (selectedBus && selectedBus._id === busId) {
        setSelectedBus(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error updating booking cutoff:', error);
      setError('Failed to update booking cutoff. Please try again.');
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const SeatManagementModal = ({ bus, onClose }) => {
    const formatDateTimeLocal = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };

    return (
      <div className="seat-modal">
        <div className="seat-modal-content">
          <div className="modal-header">
            <h3>Manage Seats - Bus {bus.number}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="bus-settings">
            <div className="time-setting">
              <label>Departure Time:</label>
              <input
                type="datetime-local"
                value={formatDateTimeLocal(bus.departureTime)}
                onChange={(e) => handleDepartureTimeChange(bus.id, e.target.value)}
              />
            </div>
            
            <div className="booking-setting">
              <label>Stop booking before (minutes):</label>
              <input
                type="number"
                value={bus.stopBookingBefore}
                onChange={(e) => handleStopBookingChange(bus.id, e.target.value)}
                min="0"
                max="120"
              />
            </div>
          </div>

          <div className="seat-grid">
            {bus.seats.map((seat, index) => (
              <div
                key={index}
                className={`seat ${seat.status || 'available'}`}
              >
                <span className="seat-number">{index + 1}</span>
                <select
                  value={seat.status || 'available'}
                  onChange={(e) => handleSeatStatusChange(bus.id, index, e.target.value)}
                  className="seat-status-select"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bus-manage">
      <div className="header">
        <h2>Bus Management</h2>
        <button 
          className="add-bus-btn"
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add New Bus'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="add-bus-form">
          <h3>Add New Bus</h3>
          <form onSubmit={handleAddBus}>
            <input
              type="text"
              placeholder="Bus Number"
              required
              value={newBus.number}
              onChange={(e) => setNewBus({...newBus, number: e.target.value})}
            />
            <input
              type="text"
              placeholder="Route"
              value={newBus.route}
              required
              onChange={(e) => setNewBus({...newBus, route: e.target.value})}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newBus.capacity}
              onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
              required
              min="1"
              max="60"
            />
            <select
              value={newBus.status}
              onChange={(e) => setNewBus({...newBus, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Bus'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading && buses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading buses...</div>
      ) : (
      <div className="bus-list">
        {buses.map(bus => {
          const availableSeats = bus.seats ? bus.seats.filter(seat => seat.status === 'available').length : 0;
          return (
          <div key={bus._id} className={`bus-card ${bus.status}`}>
            <div className="bus-info">
              <h3>{bus.number}</h3>
              <p>Route: {bus.route}</p>
              <p>Capacity: {bus.capacity} seats</p>
              <p>Status: {bus.status}</p>
              <p>Available Seats: {availableSeats}/{bus.capacity}</p>
            </div>
            <div className="bus-actions">
              <select
                value={bus.status}
                onChange={(e) => handleStatusChange(bus._id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={() => handleDeleteBus(bus._id)}>Delete</button>
              <button 
                className="manage-seats-btn"
                onClick={() => {
                  setSelectedBus(bus);
                  setShowSeatModal(true);
                }}
              >
                Manage Seats
              </button>
            </div>
          </div>
        );
        })}
      </div>
      )}

      {showSeatModal && selectedBus && (
        <SeatManagementModal
          bus={selectedBus}
          onClose={() => {
            setShowSeatModal(false);
            setSelectedBus(null);
          }}
        />
      )}
    </div>
  );
}

export default BusManage;