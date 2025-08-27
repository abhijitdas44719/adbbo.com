@@ .. @@
 import React, { useState } from 'react'
 import './BusManage.css'
 import { useBusContext } from '../context/BusContext'
 import axios from 'axios'
 import { useEffect } from 'react';

 function BusManage() {
   const { buses, setBuses } = useBusContext();
   const [showAddForm, setShowAddForm] = useState(false);
+  const [loading, setLoading] = useState(true);
+  const [error, setError] = useState(null);
   const [newBus, setNewBus] = useState({
     number: '',
     route: '',
     capacity: '',
     status: 'active'
   });
   const [selectedBus, setSelectedBus] = useState(null);
   const [showSeatModal, setShowSeatModal] = useState(false);

-  const handleAddBus = (e) => {
+  // Fetch buses from backend
+  const fetchBuses = async () => {
+    try {
+      setLoading(true);
+      const response = await axios.get('/api/buses');
+      setBuses(response.data);
+      setError(null);
+    } catch (error) {
+      console.error('Error fetching buses:', error);
+      setError('Failed to fetch buses. Please try again.');
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleAddBus = async (e) => {
     e.preventDefault();
-    setBuses([...buses, { 
-      ...newBus, 
-      id: buses.length + 1,
-      seats: Array(parseInt(newBus.capacity)).fill({ status: 'available' }),
-      departureTime: new Date().toISOString().slice(0, 16),
-      stopBookingBefore: 30
-    }]);
-    setNewBus({ number: '', route: '', capacity: '', status: 'active' });
-    setShowAddForm(false);
+    try {
+      setLoading(true);
+      const response = await axios.post('/api/buses', {
+        ...newBus,
+        capacity: parseInt(newBus.capacity)
+      });
+      
+      setBuses([...buses, response.data]);
+      setNewBus({ number: '', route: '', capacity: '', status: 'active' });
+      setShowAddForm(false);
+      setError(null);
+    } catch (error) {
+      console.error('Error adding bus:', error);
+      setError(error.response?.data?.message || 'Failed to add bus. Please try again.');
+    } finally {
+      setLoading(false);
+    }
   };

-  const handleStatusChange = (id, newStatus) => {
-    setBuses(buses.map(bus => 
-      bus.id === id ? { ...bus, status: newStatus } : bus
-    ));
+  const handleStatusChange = async (id, newStatus) => {
+    try {
+      const response = await axios.patch(`/api/buses/${id}/status`, { status: newStatus });
+      setBuses(buses.map(bus => 
+        bus._id === id ? response.data : bus
+      ));
+      setError(null);
+    } catch (error) {
+      console.error('Error updating bus status:', error);
+      setError('Failed to update bus status. Please try again.');
+    }
   };

-  const handleDeleteBus = (id) => {
-    setBuses(buses.filter(bus => bus.id !== id));
+  const handleDeleteBus = async (id) => {
+    if (!window.confirm('Are you sure you want to delete this bus?')) {
+      return;
+    }
+    
+    try {
+      await axios.delete(`/api/buses/${id}`);
+      setBuses(buses.filter(bus => bus._id !== id));
+      setError(null);
+    } catch (error) {
+      console.error('Error deleting bus:', error);
+      setError('Failed to delete bus. Please try again.');
+    }
   };

-  const handleSeatStatusChange = (busId, seatIndex, newStatus) => {
-    setBuses(buses.map(bus => {
-      if (bus.id === busId) {
-        const newSeats = [...bus.seats];
-        newSeats[seatIndex] = { ...newSeats[seatIndex], status: newStatus };
-        return { ...bus, seats: newSeats };
-      }
-      return bus;
-    }));
+  const handleSeatStatusChange = async (busId, seatIndex, newStatus) => {
+    try {
+      const response = await axios.patch(`/api/buses/${busId}/seats/${seatIndex}`, { 
+        status: newStatus 
+      });
+      
+      setBuses(buses.map(bus => 
+        bus._id === busId ? response.data : bus
+      ));
+      
+      // Update selected bus for modal
+      if (selectedBus && selectedBus._id === busId) {
+        setSelectedBus(response.data);
+      }
+      setError(null);
+    } catch (error) {
+      console.error('Error updating seat status:', error);
+      setError('Failed to update seat status. Please try again.');
+    }
   };

-  const handleDepartureTimeChange = (busId, newTime) => {
-    setBuses(buses.map(bus => 
-      bus.id === busId ? { ...bus, departureTime: newTime } : bus
-    ));
+  const handleDepartureTimeChange = async (busId, newTime) => {
+    try {
+      const response = await axios.patch(`/api/buses/${busId}/departure`, { 
+        departureTime: newTime 
+      });
+      
+      setBuses(buses.map(bus => 
+        bus._id === busId ? response.data : bus
+      ));
+      
+      if (selectedBus && selectedBus._id === busId) {
+        setSelectedBus(response.data);
+      }
+      setError(null);
+    } catch (error) {
+      console.error('Error updating departure time:', error);
+      setError('Failed to update departure time. Please try again.');
+    }
   };

-  const handleStopBookingChange = (busId, minutes) => {
-    setBuses(buses.map(bus => 
-      bus.id === busId ? { ...bus, stopBookingBefore: minutes } : bus
-    ));
+  const handleStopBookingChange = async (busId, minutes) => {
+    try {
+      const response = await axios.patch(`/api/buses/${busId}/booking-cutoff`, { 
+        stopBookingBefore: parseInt(minutes) 
+      });
+      
+      setBuses(buses.map(bus => 
+        bus._id === busId ? response.data : bus
+      ));
+      
+      if (selectedBus && selectedBus._id === busId) {
+        setSelectedBus(response.data);
+      }
+      setError(null);
+    } catch (error) {
+      console.error('Error updating booking cutoff:', error);
+      setError('Failed to update booking cutoff. Please try again.');
+    }
   };

   useEffect(() => {
-    axios.get('/api/buses')
-      .then(response => {
-        const busesWithSeats = response.data.map(bus => ({
-          ...bus,
-          seats: Array(bus.capacity).fill({ status: 'available' }),
-          departureTime: new Date().toISOString().slice(0, 16),
-          stopBookingBefore: 30
-        }));
-        setBuses(busesWithSeats);
-      })
-      .catch(error => {
-        console.error('Error fetching buses:', error);
-      });
-  })
+    fetchBuses();
+  }, []);
+
   const SeatManagementModal = ({ bus, onClose }) => {
+    const formatDateTimeLocal = (dateString) => {
+      const date = new Date(dateString);
+      return date.toISOString().slice(0, 16);
+    };
+
     return (
       <div className="seat-modal">
         <div className="seat-modal-content">
@@ -140,7 +217,7 @@
             <div className="time-setting">
               <label>Departure Time:</label>
               <input
                 type="datetime-local"
-                value={bus.departureTime}
+                value={formatDateTimeLocal(bus.departureTime)}
                 onChange={(e) => handleDepartureTimeChange(bus.id, e.target.value)}
               />
             </div>
@@ -158,7 +235,7 @@
           <div className="seat-grid">
             {bus.seats.map((seat, index) => (
               <div
                 key={index}
-                className={`seat ${seat.status}`}
+                className={`seat ${seat.status || 'available'}`}
               >
                 <span className="seat-number">{index + 1}</span>
                 <select
-                  value={seat.status}
+                  value={seat.status || 'available'}
                   onChange={(e) => handleSeatStatusChange(bus.id, index, e.target.value)}
                   className="seat-status-select"
                 >
@@ -195,6 +272,20 @@
         <button 
           className="add-bus-btn"
           onClick={() => setShowAddForm(true)}
+          disabled={loading}
         >
-          Add New Bus
+          {loading ? 'Loading...' : 'Add New Bus'}
         </button>
       </div>

+      {error && (
+        <div style={{
+          background: '#f8d7da',
+          color: '#721c24',
+          padding: '12px',
+          borderRadius: '4px',
+          marginBottom: '20px',
+          border: '1px solid #f5c6cb'
+        }}>
+          {error}
+        </div>
+      )}
+
       {showAddForm && (
@@ -202,6 +293,7 @@
           <h3>Add New Bus</h3>
           <form onSubmit={handleAddBus}>
             <input
               type="text"
               placeholder="Bus Number"
+              required
               value={newBus.number}
               onChange={(e) => setNewBus({...newBus, number: e.target.value})}
             />
@@ -209,6 +301,7 @@
               type="text"
               placeholder="Route"
               value={newBus.route}
+              required
               onChange={(e) => setNewBus({...newBus, route: e.target.value})}
             />
             <input
@@ -216,6 +309,8 @@
               placeholder="Capacity"
               value={newBus.capacity}
               onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
+              required
+              min="1"
+              max="60"
             />
             <select
               value={newBus.status}
@@ -227,7 +322,9 @@
             </select>
             <div className="form-buttons">
-              <button type="submit">Add Bus</button>
+              <button type="submit" disabled={loading}>
+                {loading ? 'Adding...' : 'Add Bus'}
+              </button>
               <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
             </div>
           </form>
@@ -235,8 +332,12 @@
       )}

+      {loading && buses.length === 0 ? (
+        <div style={{ textAlign: 'center', padding: '40px' }}>Loading buses...</div>
+      ) : (
       <div className="bus-list">
-        {buses.map(bus => (
+        {buses.map(bus => {
+          const availableSeats = bus.seats ? bus.seats.filter(seat => seat.status === 'available').length : 0;
+          return (
-          <div key={bus.id} className={`bus-card ${bus.status}`}>
+          <div key={bus._id} className={`bus-card ${bus.status}`}>
             <div className="bus-info">
               <h3>{bus.number}</h3>
               <p>Route: {bus.route}</p>
               <p>Capacity: {bus.capacity} seats</p>
               <p>Status: {bus.status}</p>
-              <p>Available Seats: {bus.seats.filter(seat => seat.status === 'available').length}/{bus.capacity}</p>
+              <p>Available Seats: {availableSeats}/{bus.capacity}</p>
             </div>
             <div className="bus-actions">
               <select
                 value={bus.status}
-                onChange={(e) => handleStatusChange(bus.id, e.target.value)}
+                onChange={(e) => handleStatusChange(bus._id, e.target.value)}
               >
                 <option value="active">Active</option>
                 <option value="maintenance">Maintenance</option>
                 <option value="inactive">Inactive</option>
               </select>
-              <button onClick={() => handleDeleteBus(bus.id)}>Delete</button>
+              <button onClick={() => handleDeleteBus(bus._id)}>Delete</button>
               <button 
                 className="manage-seats-btn"
                 onClick={() => {
@@ -260,8 +361,10 @@
               </button>
             </div>
           </div>
-        ))}
+        );
+        })}
       </div>
+      )}

       {showSeatModal && selectedBus && (
         <SeatManagementModal