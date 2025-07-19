import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EditOutlined, 
  FieldTimeOutlined  ,
  DeleteOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import useEventStore from '../../stores/eventStore';
import './EventCard.css'; 

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTime = () => {
      if (!targetDate) return;

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

const getNearestDateEntry = (dates = []) => {
  const now = dayjs();
  const futureDates = dates
    .filter(d => dayjs(d.date).isAfter(now)) 
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))); 
  return futureDates.length > 0 ? futureDates[0] : null;
};

const EventCard = ({ event, onDelete }) => {
  const [saved, setSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const nearestDate = getNearestDateEntry(event.dates);
  const { user: authuser, getMe } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const { deleteEvent } = useEventStore();

  const handleDeleteClick = (e, eventId) => {
    e.stopPropagation();
    setSelectedEventId(eventId);
    setShowConfirm(true);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleCardDetails = (eventId) => {
    if(authuser?.user?.role === "organizer") {
      navigate(`/organizer-event-details/${eventId}`);
    } else  {
      navigate(`/event-details/${eventId}`);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(selectedEventId);
      message.success('Event deleted successfully');
      navigate('/manage-events');
      if (onDelete) {
        onDelete(selectedEventId);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setShowConfirm(false);
      setSelectedEventId(null);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getMe();
      } catch(err) {
        message.error(err.response?.data?.message || 'Failed to load user data');
      }
    };
    fetchUser();
  }, []);

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
            src={`${import.meta.env.VITE_API_URL}${event.image}`}
            crossOrigin="anonymous"
            className="event-card-image"
          />
        }
      >
       
       
         
       {authuser?.user?.role === "organizer" ? (
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
       ):(
          <Button
            type="text"
            icon={saved ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={handleSaveClick}
            className="event-card-save-btn"
          />
       )}
        
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
              Book Now
            </Button>
          </div>
        )}
      </Card>

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