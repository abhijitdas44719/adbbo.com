import React, { useState } from 'react'
import './BusManage.css'
import { useBusContext } from '../context/BusContext'
import axios from 'axios'
import { useEffect } from 'react';

function BusManage() {
  const { buses, setBuses } = useBusContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBus, setNewBus] = useState({
    number: '',
    route: '',
    capacity: '',
    status: 'active'
  });
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const handleAddBus = (e) => {
    e.preventDefault();
    setBuses([...buses, { 
      ...newBus, 
      id: buses.length + 1,
      seats: Array(parseInt(newBus.capacity)).fill({ status: 'available' }),
      departureTime: new Date().toISOString().slice(0, 16),
      stopBookingBefore: 30
    }]);
    setNewBus({ number: '', route: '', capacity: '', status: 'active' });
    setShowAddForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setBuses(buses.map(bus => 
      bus.id === id ? { ...bus, status: newStatus } : bus
    ));
  };

  const handleDeleteBus = (id) => {
    setBuses(buses.filter(bus => bus.id !== id));
  };

  const handleSeatStatusChange = (busId, seatIndex, newStatus) => {
    setBuses(buses.map(bus => {
      if (bus.id === busId) {
        const newSeats = [...bus.seats];
        newSeats[seatIndex] = { ...newSeats[seatIndex], status: newStatus };
        return { ...bus, seats: newSeats };
      }
      return bus;
    }));
  };

  const handleDepartureTimeChange = (busId, newTime) => {
    setBuses(buses.map(bus => 
      bus.id === busId ? { ...bus, departureTime: newTime } : bus
    ));
  };

  const handleStopBookingChange = (busId, minutes) => {
    setBuses(buses.map(bus => 
      bus.id === busId ? { ...bus, stopBookingBefore: minutes } : bus
    ));
  };

  useEffect(() => {
    axios.get('/api/buses')
      .then(response => {
        const busesWithSeats = response.data.map(bus => ({
          ...bus,
          seats: Array(bus.capacity).fill({ status: 'available' }),
          departureTime: new Date().toISOString().slice(0, 16),
          stopBookingBefore: 30
        }));
        setBuses(busesWithSeats);
      })
      .catch(error => {
        console.error('Error fetching buses:', error);
      });
  })
  const SeatManagementModal = ({ bus, onClose }) => {
    return (
      <div className="seat-modal">
        <div className="seat-modal-content">
          <h3>Seat Management - {bus.number}</h3>
          
          <div className="schedule-controls">
            <div className="time-setting">
              <label>Departure Time:</label>
              <input
                type="datetime-local"
                value={bus.departureTime}
                onChange={(e) => handleDepartureTimeChange(bus.id, e.target.value)}
              />
            </div>
            <div className="booking-cutoff">
              <label>Stop Booking Before (minutes):</label>
              <input
                type="number"
                value={bus.stopBookingBefore}
                onChange={(e) => handleStopBookingChange(bus.id, e.target.value)}
                min="0"
                max="180"
              />
            </div>
          </div>

          <div className="seat-grid">
            {bus.seats.map((seat, index) => (
              <div
                key={index}
                className={`seat ${seat.status}`}
              >
                <span className="seat-number">{index + 1}</span>
                <select
                  value={seat.status}
                  onChange={(e) => handleSeatStatusChange(bus.id, index, e.target.value)}
                  className="seat-status-select"
                >
                  <option value="available">Available</option>
                  <option value="locked">Locked</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            ))}
          </div>
          
          <div className="seat-legend">
            <div className="legend-item available">Available</div>
            <div className="legend-item locked">Locked</div>
            <div className="legend-item booked">Booked</div>
          </div>
          
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  const popularRoutes = [
    'Mumbai-Pune',
    'Delhi-Jaipur',
    'Bangalore-Chennai',
    'Hyderabad-Bangalore',
    'Chennai-Coimbatore'
  ];

  return (
    <div className="bus-manage-container">
      <div className="bus-header">
        <h1>Indian Interstate Bus Management</h1>
        <button 
          className="add-bus-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Bus
        </button>
      </div>

      {showAddForm && (
        <div className="add-bus-form">
          <h3>Add New Bus</h3>
          <form onSubmit={handleAddBus}>
            <input
              type="text"
              placeholder="Bus Number"
              value={newBus.number}
              onChange={(e) => setNewBus({...newBus, number: e.target.value})}
            />
            <input
              type="text"
              placeholder="Route"
              value={newBus.route}
              onChange={(e) => setNewBus({...newBus, route: e.target.value})}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newBus.capacity}
              onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
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
              <button type="submit">Add Bus</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bus-list">
        {buses.map(bus => (
          <div key={bus.id} className={`bus-card ${bus.status}`}>
            <div className="bus-info">
              <h3>{bus.number}</h3>
              <p>Route: {bus.route}</p>
              <p>Capacity: {bus.capacity} seats</p>
              <p>Status: {bus.status}</p>
              <p>Available Seats: {bus.seats.filter(seat => seat.status === 'available').length}/{bus.capacity}</p>
            </div>
            <div className="bus-actions">
              <select
                value={bus.status}
                onChange={(e) => handleStatusChange(bus.id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              <button onClick={() => handleDeleteBus(bus.id)}>Delete</button>
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
        ))}
      </div>

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
  )

}

export default BusManage

//       <div className="bus-list">
//         {buses.map(bus => (
//         <div>

//           <div key={bus.id} className={`bus-card ${bus.status}`}>  
//               <button>  
//                 Manage Seats
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showSeatModal && selectedBus && (
//         <SeatManagementModal
//           bus={selectedBus}
//           onClose={() => {
//             setShowSeatModal(false);
//             setSelectedBus(null);
//           }}
//         />
//       )}
// //     </div>
// //   )
// // }

// export default BusManage
