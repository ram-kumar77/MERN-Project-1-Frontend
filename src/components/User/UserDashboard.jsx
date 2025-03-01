import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import axiosInstance from '../../api/axiosConfig';
import EventCard from '../Events/EventCard'; // Ensure EventCard is imported
import PropTypes from 'prop-types';

const BookingCard = ({ booking, onCancel, isPast = false }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">{booking.event?.title || 'Event Title Not Available'}</h3>
      {!isPast && (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel this booking?")) {
              onCancel(booking._id);
            }
          }}
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
          {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'Date Not Available'}
        </p>
        <p>
          <strong>Location:</strong> {booking.event?.location || 'Location Not Available'}
        </p>
        <p>
          <strong>Ticket Type:</strong> {booking.ticketType || 'Type Not Available'}
        </p>
        <p>
          <strong>Purchase Date:</strong> {new Date(booking.purchaseDate).toLocaleDateString() || 'Date Not Available'}
        </p>
      </div>
      <div>
        <p>
          <strong>Quantity:</strong> {booking.quantity}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{booking.totalPrice}
        </p>
        <p>
          <strong>Payment Method:</strong> {booking.paymentMethod || 'Payment Method Not Available'}
        </p>
      </div>
    </div>
  </div>
);

BookingCard.propTypes = {
  booking: PropTypes.shape({
    event: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
      location: PropTypes.string,
    }),
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired,
    ticketType: PropTypes.string.isRequired, // Added ticketType prop
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  isPast: PropTypes.bool,
};

const UserDashboard = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketsData, setTicketsData] = useState([]); // Add state for ticketsData
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user tickets
        console.log('Fetching user tickets...');
        const ticketsResponse = await axiosInstance.get('/api/tickets/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Tickets response:', ticketsResponse.data);

        const now = new Date();

        // Handle tickets response
        const ticketsData = Array.isArray(ticketsResponse.data) ? ticketsResponse.data : [];
        console.log('Fetched tickets:', ticketsData); // Log fetched tickets

        // Filter past tickets
        const pastTicketsData = ticketsData.filter(
          (ticket) => ticket.event && new Date(ticket.event.date) < now
        );

        setPastBookings(pastTicketsData);

        // Fetch events
        console.log('Fetching events...');
        const eventsResponse = await axiosInstance.get('api/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Events response:', eventsResponse.data);

        const eventsData = eventsResponse.data?.success ? eventsResponse.data.events : [];
        console.log('Fetched events:', eventsData); // Log fetched events

        setEvents(eventsData.reverse()); // Reverse the order of events
      } catch (error) {
        console.error('Failed to fetch user data', error);
        if (error.response?.status === 401) {
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
      await axiosInstance.delete(`/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setPastBookings((prevTickets) =>
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

        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Bookings</h2>
          {pastBookings.length === 0 ? (
            <p className="text-gray-600">No past events for bookings</p>
          ) : (
            pastBookings.map((ticket) => (
              <BookingCard key={ticket._id} booking={ticket} isPast={true} onCancel={handleCancelTicket} />
            ))
          )}
        </section>

        {/* New Events Section */}
        <section className="mb-12 mt-5 bg-gray-100 rounded-md w-full p-5">
          <h2 className="text-2xl font-semibold mb-6">Check New Events: <span className='text-blue-600'>New Events Listed First</span></h2>
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

      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
