import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import Swal from 'sweetalert2';

const CartItems = () => {
  const isCancelable = (orderDateStr) => {
  const orderDate = new Date(orderDateStr);
  const now = new Date();
  const diffTime = now - orderDate; // milliseconds difference
  const diffDays = diffTime / (1000 * 60 * 60 * 24); // convert to days
  return diffDays <= 2;
};
const isShippedEligible = (orderDateStr) => {
  const orderDate = new Date(orderDateStr);
  const now = new Date();
  const diffTime = now - orderDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 2;
};


  // Format date nicely
  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',   // e.g., Wed
      year: 'numeric',    // e.g., 2025
      month: 'short',     // e.g., Jun
      day: 'numeric',     // e.g., 3
      hour: '2-digit',    // e.g., 11
      minute: '2-digit',  // e.g., 05
      hour12: true,       // 12-hour format with AM/PM
    });
  };

  const { getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart } = useContext(ShopContext);

  const [showModal, setShowModal] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({ name: '', address: '', city: '', zip: '', phone: '' });
  const [orders, setOrders] = useState([]);

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/myorders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch orders:', data.message);
        }
      } catch (err) {
        console.error('Network error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  // Check if cart is empty and open modal
  const handleCheckoutClick = () => {
    const isEmpty = Object.values(cartItems).every(quantity => quantity === 0);
    setIsCartEmpty(isEmpty);
    setShowModal(true);
  };

  // Submit checkout form
  const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, address, city, zip, phone } = checkoutInfo;
  if (!name || !address || !city || !zip || !phone) {
    alert('🚨 Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/placeorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({
        checkoutInfo,
        cartSnapshot: cartItems,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Order failed to save:', data.message);
      alert('❌ Failed to save order.');
    } else {
      const newOrderFromDB = {
        ...data.order,
        // Ensure these exist in the object returned from backend
        checkoutInfo: data.order.checkoutInfo,
        cartSnapshot: data.order.cartSnapshot,
        date: data.order.date || new Date().toISOString(),
      };
      setOrders(prev => [...prev, newOrderFromDB]);
      console.log('✅ Order saved to DB with _id:', data.order._id);
    }
  } catch (err) {
    console.error('Network error saving order:', err);
    alert('⚠️ Could not reach server.');
  }

  setShowModal(false);
  setShowThankYou(true);
};


  // Clear cart from backend
  const clearCartFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:4000/clearcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to clear cart on backend:', data.message);
      } else {
        console.log('Backend cart cleared');
      }
    } catch (error) {
      console.error('Error clearing cart from backend:', error);
    }
  };

  // Close thank you modal and clear cart
  const handleThankYouClose = async () => {
    await clearCartFromBackend();
    clearCart();
    setShowThankYou(false);
    setCheckoutInfo({ name: '', address: '', city: '', zip: '', phone: '' });
  };

  // Get products info for an order snapshot
  const getProductsInOrder = (cartSnapshot) => {
    return all_product
      .filter(product => cartSnapshot[product.id] > 0)
      .map(product => ({
        id: product.id,
        name: product.title || product.name || `Product ${product.id}`,
        quantity: cartSnapshot[product.id],
        price: product.new_price,
        image: product.image,
      }));
  };

  // Remove order from queue (frontend only)

const handleRemoveOrder = async (orderId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:4000/deleteorder/${orderId}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('auth-token'), // use your stored token here
        }
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
        // Remove the deleted order from local state to update UI
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      } else {
        Swal.fire('Error!', data.message || 'Failed to delete order.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  }
};




  return (
    <div className="cartitems" style={{ maxWidth: 900, margin: 'auto', padding: '1rem' }}>
      {/* Cart header */}
      <div className="cartitems-format-main" style={{ display: 'flex', gap: '2rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
        <p style={{ flex: 2 }}>Products</p>
        <p style={{ flex: 1 }}>Price</p>
        <p style={{ flex: 1 }}>Quantity</p>
        <p style={{ flex: 0.5 }}>Remove</p>
      </div>
      <hr style={{ marginBottom: '1rem' }} />

      {/* Cart items */}
      {all_product.map(product => (
        cartItems[product.id] > 0 ? (
          <div
            key={product.id}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
          >
            <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={product.image}
                alt={product.name || product.title}
                style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 6 }}
              />
              <p>{product.title || product.name || `Product ${product.id}`}</p>
            </div>
            <p style={{ flex: 1, fontWeight: 'bold' }}>${(product.new_price * cartItems[product.id]).toFixed(2)}</p>
            <div style={{ flex: 1 }}>
              <span
                style={{
                  padding: '6px 12px',
                  fontWeight: 'bold',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {cartItems[product.id]}
              </span>
            </div>
            <div style={{ flex: 0.5 }}>
              <button
                title="Remove"
                onClick={() => removeFromCart(product.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc3545',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ) : null
      ))}

      {/* Cart totals and checkout */}
      <div
        className="cartitems-down"
        style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: 8,
          backgroundColor: '#fafafa',
        }}
      >
        <div className="cartitems-total" style={{ marginBottom: '1rem' }}>
          <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Cart Totals</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p>Subtotal</p>
            <p>${getTotalCartAmount().toFixed(2)}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <p>Shipping Fees</p>
            <p>Free</p>
          </div>
          <hr />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              marginTop: 8,
            }}
          >
            <h3>Total</h3>
            <h3>${getTotalCartAmount().toFixed(2)}</h3>
          </div>
          <button
            onClick={handleCheckoutClick}
            style={{
              marginTop: '1rem',
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: '100%',
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: 10,
              maxWidth: 450,
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          >
            {isCartEmpty ? (
              <>
                <h2>Your cart is empty 🛒</h2>
                <p>Please add something to your cart before checking out.</p>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    marginTop: '1rem',
                    padding: '10px 20px',
                    borderRadius: 6,
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2>Shipping Information</h2>
                {['name', 'address', 'city', 'zip', 'phone'].map(field => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={checkoutInfo[field]}
                    onChange={e => setCheckoutInfo({ ...checkoutInfo, [field]: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      margin: '0.5rem 0',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                    }}
                  />
                ))}
                <button
                  type="submit"
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                  }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYou && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: 10,
              maxWidth: 450,
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <h2>Thank you for your order! 🎉</h2>
            <p>We will provide you the shipping Id Via Email And Text</p>
            <button
              onClick={handleThankYouClose}
              style={{
                marginTop: '1.5rem',
                padding: '12px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Orders Queue */}
      <div
        className="orders-queue"
        style={{
          marginTop: '3rem',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
          borderTop: '2px solid #eee',
          paddingTop: '1rem',
        }}
      >
        <h2>Your Orders Queue</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map(order => (
            <div
              key={order._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: '1rem',
                marginBottom: '1rem',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}
            >
              <p style={{ fontWeight: 'bold', marginBottom: 6,position:"relative" }}>
                Order Date: {formatDateTime(order.date)}
                 {isShippedEligible(order.date) && (
    <p className="shipping-icon" style={{ color: '#007bff', fontWeight: 'bold' }}>
      🚚 Shipping...
    </p>
  )}
              </p>
              

              <div
              style={{
                position:"relative"
              }}
              >
                <h3>Products:</h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {getProductsInOrder(order.cartSnapshot).map(prod => (
                    <li
                      key={prod.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 6 }}
                      />
                      <div>
                        <p style={{ margin: 0 }}>{prod.name}</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                          {prod.quantity} × ${prod.price.toFixed(2)} = ${(prod.price * prod.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ fontWeight: 'bold' }}>
                Total : ${Object.entries(order.cartSnapshot).reduce((acc, [prodId, qty]) => {
                  const prod = all_product.find(p => p.id === +prodId);
                  return prod && qty ? acc + prod.new_price * qty : acc;
                }, 0).toFixed(2)}
              </p>
              <p>
               <i> Shipping to</i>: <br/> <b>Name</b> : {order.checkoutInfo.name}, <br/> <b> Address</b> :  {order.checkoutInfo.address}, <b>{order.checkoutInfo.city}</b>, {order.checkoutInfo.zip},<br /> <b>Phone </b>: {order.checkoutInfo.phone}
              </p>
              <button
                onClick={() => handleRemoveOrder(order._id)}
                 disabled={!isCancelable(order.date)}
                 title={!isCancelable(order.date) ? "Cannot cancel orders older than 2 days" : ""}
                 className={`btn-remove ${isCancelable(order.date) ? 'active' : 'disabled'}`}
             
              >
                Cancel Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartItems;
