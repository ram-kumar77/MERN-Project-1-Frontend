import React, { useState } from 'react';

const CreateEventModal = ({ onClose, onCreateEvent }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    ticketPrice: '',
    availableTickets: '',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateEvent(eventData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) => setEventData({...eventData, title: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <textarea
            placeholder="Event Description"
            value={eventData.description}
            onChange={(e) => setEventData({...eventData, description: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({...eventData, date: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={eventData.location}
            onChange={(e) => setEventData({...eventData, location: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="number"
            placeholder="Ticket Price"
            value={eventData.ticketPrice}
            onChange={(e) => setEventData({...eventData, ticketPrice: parseFloat(e.target.value)})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="number"
            placeholder="Available Tickets"
            value={eventData.availableTickets}
            onChange={(e) => setEventData({...eventData, availableTickets: parseInt(e.target.value)})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={eventData.image}
            onChange={(e) => setEventData({...eventData, image: e.target.value})}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;