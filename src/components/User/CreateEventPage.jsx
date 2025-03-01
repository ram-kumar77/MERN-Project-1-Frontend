import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const CreateEventPage = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    ticketPrice: '',
    availableTickets: '',
    image: ''
  });
  const [existingEvents, setExistingEvents] = useState([]);

  useEffect(() => {
    const fetchExistingEvents = async () => {
      try {
        const response = await axiosInstance.get('api/events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setExistingEvents(response.data.events);
      } catch (error) {
        console.error('Failed to fetch existing events', error);
      }
    };

    fetchExistingEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('api/events', eventData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Event created successfully');
      setExistingEvents(prevEvents => [...prevEvents, response.data]);
      setEventData({
        title: '',
        description: '',
        date: '',
        location: '',
        ticketPrice: '',
        availableTickets: '',
        image: ''
      });
    } catch (error) {
      console.error('Failed to create event', error);
      alert('Failed to create event');
    }
  };

  return (
    <div className="">
      <Navbar />

      <div className="bg-gray-100 py-12 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Manage & Explore Events
          </h2>
          <p className="text-lg text-gray-600">
            You can view and create events effortlessly. As a user, you have the 
            freedom to list your own events, making them accessible to others. 
            However, to maintain quality and appropriateness, admins have the 
            authority to delete events if they are found unsuitable.
          </p>
        </div>
      </div>

      <div className="container h-auto  mx-auto p-8 flex flex-row gap-10 justify-between">
        <div className="">
          <h3 className="text-xl font-bold mt-6 ">Existing Events</h3>
          <div className="mt-4 space-y-5 overflow-y-auto h-96 rounded-sm bg-slate-50 p-5 "> {/* Added scrollable container */}
            {existingEvents.length > 0 ? (
              existingEvents.map(event => (
                <div key={event._id} className="border rounded-lg p-2 mb-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <img 
                    src={event.image || '/default-event.jpg'} 
                    alt={event.title}
                    className="w-full h-20 object-cover rounded-md" // Adjusted image size
                  />
                  <p>{event.description}</p>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>
              ))
            ) : (
              <p>No existing events found.</p>
            )}
          </div>
        </div>

        <div className='w-1/2 border border-blue-600 p-5 rounded-md shadow-lg '>
          <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="mb-8">
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
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEventData({...eventData, image: reader.result || ''}); // Ensure image is always defined
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button 
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CreateEventPage;
