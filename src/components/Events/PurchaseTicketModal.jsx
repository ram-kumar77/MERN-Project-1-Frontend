import React, { useState } from "react";
import axios from "axios";

const PurchaseTicketModal = ({ event, onClose }) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [name, setName] = useState("Ramkumar"); // Default name
  const [email, setEmail] = useState("baajanlaal@gmail.com"); // Default email
  const [phone, setPhone] = useState("08939951400"); // Default phone
  const [paypalEmail, setPaypalEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [ticketType, setTicketType] = useState("vip"); // Default ticket type

  // Handle ticket quantity changes properly
  const handleQuantityChange = (e) => {
    let value = e.target.value;
  
    // Allow empty input (temporary) for smooth UX
    if (value === "") {
      setTicketQuantity("");
      return;
    }
  
    value = Number(value); // Convert input to a number
  
    if (!isNaN(value) && value >= 1) {
      setTicketQuantity(value); // Update only valid numbers
    }
  };
  
  // Ensures input resets to at least 1
  const handleBlur = () => {
    if (!ticketQuantity || isNaN(ticketQuantity)) {
      setTicketQuantity(1);
    }
  };
  
  // Calculate total price dynamically
  const ticketPrice = ticketType === "vip" ? event.ticketPrice + 150 : event.ticketPrice;
  const totalPrice = ticketPrice * ticketQuantity;

  const handlePurchase = async () => {
    if (!name || !email || !phone || !ticketQuantity || !ticketType) {
      alert("Please fill in all required fields.");
      return;
    }

    // Log the values being sent
    console.log("Sending purchase request with the following data:");
    console.log("Event ID:", event._id);
    console.log("Quantity:", ticketQuantity);
    console.log("Payment Method:", paymentMethod);
    console.log("Ticket Type:", ticketType);
    console.log("User Details:", { name, email, phone });

    try {
      const response = await axios.post(
        "https://mern-project-1-backend-1.onrender.com/api/tickets/purchase",
        {
          eventId: event._id,
          quantity: ticketQuantity,
          paymentMethod,
          ticketType,
          totalPrice,
          userDetails: { name, email, phone },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Ticket purchased successfully!");
      onClose();
    } catch (error) {
      alert("Ticket purchase failed");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-1/2 flex">

        {/* Left Side: User Details & Ticket Selection */}
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4">Purchase Ticket</h2>

          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Number of Tickets</label>
            <input
              type="number"
              min="1"
              value={ticketQuantity}
              onChange={handleQuantityChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Ticket Type</label>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="general">General</option>
              <option value="vip">VIP (+₹150)</option>
            </select>
          </div>
        </div>

        {/* Right Side: Payment Details */}
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

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

          {/* Conditional Payment Fields */}
          {(paymentMethod === "credit" || paymentMethod === "debit") && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </>
          )}

          {paymentMethod === "paypal" && (
            <div className="mb-4">
              <label className="block mb-2">PayPal Email</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div className="mb-4 font-bold">
            <strong>Total Price:</strong> ₹{totalPrice}
          </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded">
          Cancel
        </button>
        <button onClick={handlePurchase} className="bg-green-500 text-white py-2 px-4 rounded">
          Purchase
        </button>
      </div>

        </div>
      </div>


    </div>
  );
};

export default PurchaseTicketModal;
