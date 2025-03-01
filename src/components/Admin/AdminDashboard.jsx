import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../api/axiosConfig';
import UserAuthentication from './userAuthentication'; // Importing UserAuthentication
import EditEventModal from './EditEventModal';
import Navigation from './Left-Navigation-Bar/Navigation';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false); // State to control User Management visibility

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const eventsResponse = await axiosInstance.get('api/events', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const eventsData = Array.isArray(eventsResponse.data?.events) ? eventsResponse.data.events : [];
        setEvents(eventsData);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        setEvents([]);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`api/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event', error);
      toast.error('Failed to delete event');
    }
  };

  // const handleCreateEvent = async (eventData) => {
  //   try {
  //     const response = await axiosInstance.post('api/events', eventData, {
  //       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  //     });

  //     setEvents(prevEvents => [...prevEvents, response.data]);
  //     toast.success('Event created successfully');
  //   } catch (error) {
  //     console.error('Failed to create event', error);
  //     toast.error('Failed to create event');
  //   }
  // };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = async (eventId, updatedData) => {
    try {
      const response = await axiosInstance.put(`api/events/${eventId}`, updatedData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId ? response.data : event
        )
      );
      setSelectedEvent(null);
      setIsEditModalOpen(false);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Failed to update event', error);
      toast.error('Failed to update event');
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 fixed h-screen bg-blue-900">
        <Navigation setShowUserManagement={setShowUserManagement} />
      </div>
      <div className="ml-64 flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Render UserAuthentication Component based on navigation */}
        {showUserManagement && <UserAuthentication />}

        {/* Events Management Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Event Management</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event._id} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => handleEditClick(event)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Edit Event Modal */}
        {isEditModalOpen && selectedEvent && (
          <EditEventModal 
            isOpen={isEditModalOpen} 
            onClose={handleCloseModal} 
            event={selectedEvent} 
            onEditEvent={(updatedData) => handleEditEvent(selectedEvent._id, updatedData)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
