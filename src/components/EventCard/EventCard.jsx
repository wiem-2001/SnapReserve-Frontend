import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useEventStore from '../../stores/eventStore';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './EventCard.css'; 

// ---------------- Timer Component ----------------
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const updateTime = () => {
      const now = dayjs();
      const diffMs = dayjs(targetDate).diff(now);

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      setTimeLeft({ days, hours, minutes });
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); 
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <div className="countdown-header">TIME REMAINING</div>
      <div className="countdown-values">
        <span>{timeLeft.days}d</span>
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
      </div>
    </div>
  );
};

// ---------------- Helper ----------------
const getNearestDateEntry = (dates = []) => {
  const now = dayjs();
  const futureDates = dates
    .filter(d => dayjs(d.date).isAfter(now)) 
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))); 
  return futureDates.length > 0 ? futureDates[0] : null;
};

// ---------------- Main Component ----------------
const EventCard = ({ event, onDelete }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const nearestDate = getNearestDateEntry(event.dates);

  const { user: authUser, getMe } = useAuthStore();
  const { deleteEvent, toggleFavorite, favoriteEvents, fetchFavorites } = useEventStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // --- Delete Event ---
  const handleDeleteClick = (e, eventId) => {
    e.stopPropagation();
    setSelectedEventId(eventId);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(selectedEventId);
      message.success('Event deleted successfully');

      if (onDelete) onDelete(selectedEventId);
      if (location.pathname !== '/manage-events') {
        navigate('/manage-events');
      }

    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setShowConfirm(false);
      setSelectedEventId(null);
    }
  };

  // --- Toggle Favorite ---
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!authUser?.user) {
      message.info('Please log in to favorite events');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    try {
      const response = await toggleFavorite(event.id);
      setIsFavorited(response.isFavorited);
      message.success(response.isFavorited ? 'Added to favorites' : 'Removed from favorites');
      await fetchFavorites(); 
    } catch (error) {
      message.error(error || 'Failed to toggle favorite');
    }
  };

  // --- Load User + Favorites ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authUser?.user) {
          await getMe();
        }
        if (authUser?.user?.role === "attendee") {
          await fetchFavorites();
        }
      } catch (err) {
        message.error(err.response?.data?.message || 'Failed to load user data or favorites');
      }
    };
    fetchData();
  }, [authUser?.user, getMe, fetchFavorites]);

  // --- Sync favorite state ---
  useEffect(() => {
    if (favoriteEvents && event?.id) {
      setIsFavorited(favoriteEvents.some(fav => fav.eventId === event.id));
    }
  }, [favoriteEvents, event?.id]);

  // --- Navigate to details ---
  const handleCardDetails = (eventId) => {
    if (authUser?.user?.role === "organizer") {
      navigate(`/organizer-event-details/${eventId}`);
    } else {
      navigate(`/event-details/${eventId}`);
    }
  };

  return (
    <div
      className="event-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !showConfirm && handleCardDetails(event.id)}
    >
      <Card
        className="event-card"
        bodyClassName="event-card-body"
        cover={
          <img
            alt={event.title}
            src={event.image ? `${import.meta.env.VITE_API_URL}${event.image}` : '/placeholder.jpg'}
            crossOrigin="anonymous"
            className="event-card-image"
          />
        }
      >
        {/* Organizer buttons or favorite button */}
        {authUser?.user?.role === "organizer" ? (
          <div className="event-card-action-btns">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#ffd72d' }} />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-event/${event.id}`);
              }}
              className="event-card-action-btn"
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#ffd72d' }} />}
              onClick={(e) => handleDeleteClick(e, event.id)}
              className="event-card-action-btn"
            />
          </div>   
        ) : (
          <Button
            type="text"
            icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={handleToggleFavorite}
            className="event-card-save-btn"
          />
        )}
        
        {/* Event Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-description">{event.description}</p>
        
          <div className="event-card-meta">
            <div className="event-card-meta-item">
              <CalendarOutlined className="event-card-meta-icon" />
              <span className="event-card-meta-text">
                {nearestDate
                  ? `${dayjs(nearestDate.date).format('YYYY-MM-DD')} at ${dayjs(nearestDate.date).format('HH:mm')}`
                  : 'No upcoming date'}
              </span>
            </div>

            <div className="event-card-meta-item">
              <EnvironmentOutlined className="event-card-meta-icon" />
              <span className="event-card-meta-text">
                {nearestDate ? nearestDate.location : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="event-card-hover-overlay">
            <CountdownTimer targetDate={nearestDate?.date} />
            <Button
              type="primary"
              shape="round"
              className="event-card-book-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCardDetails(event.id);
              }}
            >
              {authUser?.user?.role === "attendee" ? "Book Now" : "View Details"}
            </Button>
          </div>
        )}
      </Card>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowConfirm(false)}
        title="Are you sure you want to delete this event?"
      />
    </div>
  );
};

export default EventCard;
