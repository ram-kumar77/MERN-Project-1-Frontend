import React, { useState } from 'react';
import axios from 'axios';

const PurchaseTicketModal = ({ event, onClose }) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const handlePurchase = async () => {
    try {
      const response = await axios.post('${baseURL}/api/tickets/purchase', {
        eventId: event._id,
        quantity: ticketQuantity,
        paymentMethod
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Ticket purchased successfully!');
      onClose();
    } catch (error) {
      alert('Ticket purchase failed');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Purchase Ticket</h2>
        <div className="mb-4">
          <label className="block mb-2">Number of Tickets</label>
          <input 
            type="number"
            min="1"
            max={event.availableTickets}
            value={ticketQuantity || 1}
            onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="credit">Credit Card</option>
            <option value="debit">Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <div className="mb-4">
          <strong>Total Price:</strong> 
          ${event.ticketPrice * ticketQuantity}
        </div>
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handlePurchase}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketModal;
