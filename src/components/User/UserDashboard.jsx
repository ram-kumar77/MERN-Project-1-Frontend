import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import axios from 'axios';
import PropTypes from 'prop-types';

const BookingCard = ({ booking, onCancel, isPast = false }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">{booking.event.title}</h3>
      {!isPast && (
        <button
          onClick={() => onCancel(booking._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel Booking
        </button>
      )}
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <p>
          <strong>Date:</strong>{' '}
          {new Date(booking.event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Location:</strong> {booking.event.location}
        </p>
      </div>
      <div>
        <p>
          <strong>Quantity:</strong> {booking.quantity}
        </p>
        <p>
          <strong>Total Price:</strong> ${booking.totalPrice}
        </p>
      </div>
    </div>
  </div>
);

BookingCard.propTypes = {
  booking: PropTypes.shape({
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired,
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  isPast: PropTypes.bool,
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-64 mx-2 flex-shrink-0">
      <img 
        src={event.image || '/default-event.jpg'} 
        alt={event.title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{event.title}</h3>
        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
        </div>
        <button
          onClick={() => navigate(`/eventdetails/${event._id}`)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Check
        </button>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};

const UserDashboard = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user tickets
        console.log('Fetching user tickets...');
        const ticketsResponse = await axios.get('${baseURL}/api/tickets/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Tickets response:', ticketsResponse.data);

        console.log('Fetching events...');
        const eventsResponse = await axios.get('${baseURL}/api/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Events response:', eventsResponse.data);

        const now = new Date();

        // Handle tickets response
        const ticketsData = Array.isArray(ticketsResponse.data) ?
          ticketsResponse.data : [];

        // Handle events response
        const eventsData = eventsResponse.data?.success ?
          eventsResponse.data.events : [];
        const activeTicketsData = ticketsData.filter(
          (ticket) => new Date(ticket.event.date) >= now
        );
        const pastTicketsData = ticketsData.filter(
          (ticket) => new Date(ticket.event.date) < now
        );

        setActiveBookings(activeTicketsData);
        setPastBookings(pastTicketsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCancelTicket = async (ticketId) => {
    try {
      await axios.delete(`/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setActiveBookings((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== ticketId)
      );
      alert('Ticket cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel ticket', error);
      alert('Failed to cancel ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        {/* New Events Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">New Events</h2>
          <div className="flex overflow-x-auto pb-4">
            {events.length === 0 ? (
              <p className="text-gray-600">No new events available</p>
            ) : (
              events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            )}
          </div>
        </section>

        {/* Active Bookings Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Active Bookings</h2>
          {activeBookings.length === 0 ? (
            <p className="text-gray-600">No active bookings</p>
          ) : (
            activeBookings.map((ticket) => (
              <BookingCard
                key={ticket._id}
                booking={ticket}
                onCancel={handleCancelTicket}
              />
            ))
          )}
        </section>

        {/* Past Bookings Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Past Events (Bookings)</h2>
          {pastBookings.length === 0 ? (
            <p className="text-gray-600">No past events for bookings</p>
          ) : (
            pastBookings.map((ticket) => (
              <BookingCard key={ticket._id} booking={ticket} isPast={true} onCancel={() => {}} />
            ))
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
