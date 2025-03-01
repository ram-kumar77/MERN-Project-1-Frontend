import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
          Check Now
        </button>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default EventCard;
