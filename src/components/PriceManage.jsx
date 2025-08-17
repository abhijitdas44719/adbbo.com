import React, { useState } from 'react'
import './PriceManage.css'

function PriceManage() {
  const [prices, setPrices] = useState([
    {
      id: 1,
      route: 'Mumbai-Delhi',
      basePrice: 1200,
      acPrice: 2000,
      todayPrice: 1500,
      discountStudent: 10,
      discountSenior: 20,
    },
    {
      id: 2,
      route: 'Bangalore-Chennai',
      basePrice: 800,
      acPrice: 1500,
      todayPrice: 1000,
      discountStudent: 15,
      discountSenior: 25,
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState({
    route: '',
    basePrice: '',
    acPrice: '',
    todayPrice: '',
    discountStudent: '',
    discountSenior: '',
  });

  const handleAddPrice = (e) => {
    e.preventDefault();
    setPrices([...prices, { ...newPrice, id: prices.length + 1 }]);
    setNewPrice({
      route: '',
      basePrice: '',
      acPrice: '',
      todayPrice: '',
      discountStudent: '',
      discountSenior: '',
    });
    setShowAddForm(false);
  };

  const handleUpdatePrice = (id, updatedPrice) => {
    setPrices(prices.map(price => 
      price.id === id ? { ...price, ...updatedPrice } : price
    ));
    setEditingPrice(null);
  };

  const handleDeletePrice = (id) => {
    setPrices(prices.filter(price => price.id !== id));
  };

  return (
    <div className="price-manage-container">
      <div className="price-header">
        <h1>Daily Price Management</h1>
        <div className="today-info">
          <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
          <button className="add-price-btn" onClick={() => setShowAddForm(true)}>
            Add New Price
          </button>
        </div>
      </div>

      {/* Add Form Section */}
      {showAddForm && (
        <div className="price-form">
          <h3>Add New Route Price</h3>
          <form onSubmit={handleAddPrice}>
            <input
              type="text"
              placeholder="Route"
              value={newPrice.route}
              onChange={(e) => setNewPrice({...newPrice, route: e.target.value})}
            />
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Base Price"
                value={newPrice.basePrice}
                onChange={(e) => setNewPrice({...newPrice, basePrice: e.target.value})}
              />
              <input
                type="number"
                placeholder="AC Price"
                value={newPrice.acPrice}
                onChange={(e) => setNewPrice({...newPrice, acPrice: e.target.value})}
              />
              <input
                type="number"
                placeholder="Today's Price"
                value={newPrice.todayPrice}
                onChange={(e) => setNewPrice({...newPrice, todayPrice: e.target.value})}
              />
            </div>
            <div className="discount-inputs">
              <input
                type="number"
                placeholder="Student Discount %"
                value={newPrice.discountStudent}
                onChange={(e) => setNewPrice({...newPrice, discountStudent: e.target.value})}
              />
              <input
                type="number"
                placeholder="Senior Discount %"
                value={newPrice.discountSenior}
                onChange={(e) => setNewPrice({...newPrice, discountSenior: e.target.value})}
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Add Price</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
          <div className="route-suggestions">
            <p>Popular Routes:</p>
            <button type="button" onClick={() => setNewPrice({...newPrice, route: 'Mumbai-Delhi'})}>Mumbai-Delhi</button>
            <button type="button" onClick={() => setNewPrice({...newPrice, route: 'Bangalore-Chennai'})}>Bangalore-Chennai</button>
            <button type="button" onClick={() => setNewPrice({...newPrice, route: 'Hyderabad-Mumbai'})}>Hyderabad-Mumbai</button>
          </div>
        </div>
      )}

      {/* Price List Section */}
      <div className="price-list">
        {prices.map(price => (
          <div key={price.id} className="price-card">
            <h3>{price.route}</h3>
            <div className="price-details">
              <p>Base Price: ₹{price.basePrice}</p>
              <p>AC Price: ₹{price.acPrice}</p>
              <p className="today-price">Today's Price: ₹{price.todayPrice}</p>
              <p>Student Discount: {price.discountStudent}%</p>
              <p>Senior Citizen Discount: {price.discountSenior}%</p>
            </div>
            <div className="price-actions">
              <button onClick={() => setEditingPrice(price)}>Edit</button>
              <button onClick={() => handleDeletePrice(price.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal Section */}
      {editingPrice && (
        <div className="edit-modal">
          <div className="edit-content">
            <h3>Edit Price - {editingPrice.route}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePrice(editingPrice.id, editingPrice);
            }}>
              <div className="price-inputs">
                <input
                  type="number"
                  value={editingPrice.basePrice}
                  onChange={(e) => setEditingPrice({...editingPrice, basePrice: e.target.value})}
                  placeholder="Base Price"
                />
                <input
                  type="number"
                  value={editingPrice.acPrice}
                  onChange={(e) => setEditingPrice({...editingPrice, acPrice: e.target.value})}
                  placeholder="AC Price"
                />
                <input
                  type="number"
                  value={editingPrice.todayPrice}
                  onChange={(e) => setEditingPrice({...editingPrice, todayPrice: e.target.value})}
                  placeholder="Today's Price"
                />
              </div>
              <div className="discount-inputs">
                <input
                  type="number"
                  value={editingPrice.discountStudent}
                  onChange={(e) => setEditingPrice({...editingPrice, discountStudent: e.target.value})}
                  placeholder="Student Discount %"
                />
                <input
                  type="number"
                  value={editingPrice.discountSenior}
                  onChange={(e) => setEditingPrice({...editingPrice, discountSenior: e.target.value})}
                  placeholder="Senior Discount %"
                />
              </div>
              <div className="edit-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingPrice(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


export default PriceManage
