 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navigate to the Event Details page using event id.
    navigate(`/eventdetails/${event._id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 transform transition hover:scale-105 flex flex-col justify-between">
      <div>
      {event.image ? (
          <img
            src={event.image}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <p className="text-xl font-bold mb-2">Image not available</p>
        )}
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-blue-600 font-semibold">{event.location}</span>
          <span className="text-green-600">${event.ticketPrice}</span>
        </div>
      </div>
      <button
        onClick={handleBookNow}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Book Now
      </button>
    </div>
  );
};

const DummyReviewCard = ({ review }) => (
  <div className="bg-gray-100 rounded-lg p-6 shadow-md">
    <p className="italic mb-4">"{review.comment}"</p>
    <div className="flex items-center">
      <span className="font-semibold mr-2">{review.username}</span>
      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
    </div>
  </div>
);

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dummyReviews = [
    { _id: 1, username: 'Alice', comment: 'Amazing experience!', rating: 5 },
    { _id: 2, username: 'Bob', comment: 'Had a great time.', rating: 4 },
    { _id: 3, username: 'Charlie', comment: 'Well organized and fun.', rating: 5 },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch events from your API
        const eventsResponse = await axiosInstance.get('/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Events API Response:', eventsResponse.data);
        
        // Ensure events is always an array
        const eventsData = Array.isArray(eventsResponse.data?.events) ? 
          eventsResponse.data.events : [];
        setEvents(eventsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch events', error);
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

{/* Hero Banner */}
<div 
  className="relative text-white text-center py-20 bg-cover bg-center" 
  style={{ backgroundImage: "url('https://www.eventsindustryforum.co.uk/images/articles/about_the_eif.jpg')" }}
>
  <div className="absolute inset-0 bg-black opacity-50"></div>
  <div className="relative z-10">
    <h1 className="text-4xl font-bold mb-4">Discover Amazing Events</h1>
    <p className="text-xl">Your gateway to unforgettable experiences</p>
  </div>
</div>

{/* About Section */}
<section className="container mx-auto my-12 px-4" id='about' >
  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
    <img 
      src="https://addyevents.in/wp-content/uploads/2024/08/corporate-events.jpg" 
      alt="About Us" 
      className="rounded-lg shadow-lg w-1/3 h-1/2 md:w-1/2"
    />
    <div className='text-center md:text-left'>
    <h2 className="bg-blue-700 p-2 text-white rounded-md text-3xl font-bold text-center mb-4">About Us</h2>
    <p className="text-gray-700 text-center md:text-left max-w-2xl">
      We are dedicated to bringing you the best events in town. Whether you’re into music, art, or technology, our platform connects you to a world of exciting experiences. Join us and be part of a community that celebrates creativity and passion.
    </p>
    </div>
  </div>
</section>


      {/* Events Section */}
      <section className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <p>No events available at the moment.</p>
          )}
        </div>
      </section>

      {/* Dummy Reviews Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dummyReviews.map((review) => (
              <DummyReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;