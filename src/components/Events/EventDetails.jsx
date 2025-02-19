import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import PurchaseTicketModal from './PurchaseTicketModal';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching event with ID:', id);
        console.log('Type of event ID:', typeof id);
        console.log('Current token:', localStorage.getItem('token'));
        
        if (!id || typeof id !== 'string') {
          throw new Error('Invalid event ID');
        }

        const response = await axios.get(`${baseURL}/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('API Response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        
        if (response.data) {
          setEvent({
            ...response.data,
            date: response.data.date || null,
            location: response.data.location || '',
            availableTickets: response.data.availableTickets || 0,
            ticketPrice: response.data.ticketPrice || 0
          });
        } else {
          setError('Event data not found');
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        setError('Failed to fetch event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handlePurchaseTicket = () => {
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  if (loading) return <div>Loading event details...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* <div className="bg-white shadow-md rounded-lg overflow-hidden"> */}
                        {/* Placeholder for event image */}
                        <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              {event.image ? (
          <img
            src={event.image}
            className="w-1/2 object-cover rounded-md mb-4"
          />
        ) : (
          <p className="text-xl font-bold mb-2">Image not available</p>
        )}

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="mb-4">
                  <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Date not available'}
                </div>
                <div className="mb-4">
                  <strong>Location:</strong> {event.location || 'Location not available'}
                </div>
                <div className="mb-4">
                  <strong>Available Tickets:</strong> {event.availableTickets || '0'}
                </div>
                <div className="mb-4 text-2xl font-bold text-green-600">
                  Ticket Price: ${event.ticketPrice || '0.00'}
                </div>
                <button
                  onClick={handlePurchaseTicket}
                  className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                >
                  Purchase Ticket
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Ticket Modal */}
        {showPurchaseModal && (
          <PurchaseTicketModal 
            event={event} 
            onClose={handleCloseModal} 
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
