import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  HeartOutlined, 
  HeartFilled, 
  EditOutlined, 
  DeleteOutlined, 
  EditFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import ConfirmModal from './ConfirmModal';
import useEventStore from '../stores/eventStore';
const CountdownTimer = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 'bold' }}>TIME REMAINING</div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 18, fontWeight: 'bold' }}>
      <span>5d</span>
      <span>12h</span>
      <span>30m</span>
    </div>
  </div>
);

const getNearestDateEntry = (dates = []) => {
  const now = dayjs();
  return dates
    .map(d => ({ ...d, diff: dayjs(d.date).diff(now) }))
    .filter(d => d.diff >= 0) 
    .sort((a, b) => a.diff - b.diff)[0]; 
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
    navigate(`/organizer-event-details/${eventId}`);
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
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 300,
        margin: '0 auto 24px',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
          if (!showConfirm) {
            handleCardDetails(event.id);
          }
        }}
    >
      <Card
        style={{
          width: '100%',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #e1c71a',
          background: isHovered ? 'rgba(255, 255, 255, 0.7)' : '#fff',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{
          padding: 16,
          height: 180,
          display: 'flex',
          flexDirection: 'column'
        }}
        cover={
          <img
            alt={event.title}
            src={`${import.meta.env.VITE_API_URL}${event.image}`}
            crossOrigin="anonymous"
            style={{
              height: 150,
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)'
            }}
          />
        }
      >
        {authuser?.user?.role === "attendee" ? (
          <Button
            type="text"
            icon={saved ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
            onClick={handleSaveClick}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
              fontSize: 20
            }}
          />
        ) : (
          <div style={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#ffd72d' }} />}
               onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-event/${event.id}`);
              }}
              style={{
                fontSize: 20,
                backgroundColor:'#021529'
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#ffd72d' }} />}
              onClick={(e) => handleDeleteClick(e, event.id)}
              style={{
                fontSize: 20,
                 backgroundColor:'#021529'
              }}
            />
          </div>   
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: 16,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: isHovered ? '#021529' : 'inherit',
          transition: 'color 0.3s ease'
        }}>
          {event.title}
        </h3>
          <p style={{
          fontSize: 13,
          color: '#444',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
        }}>
          {event.description}
        </p>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#666' }} />
            <span style={{ fontSize: 12 }}>
              {nearestDate ? dayjs(nearestDate.date).format('YYYY-MM-DD') : 'No upcoming date'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ marginRight: 8, color: '#666' }} />
            <span style={{ fontSize: 12 }}>
              {nearestDate ? nearestDate.location : 'N/A'}
            </span>
          </div>
        </div>
        </div>

        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            padding: 16,
            zIndex: 1
          }}>
            <CountdownTimer />
            <Button
              type="primary"
              shape="round"
              style={{
                backgroundColor: '#021529',
                borderColor: '#021529',
                marginTop: 16,
                fontWeight: 'bold',
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease',
                color: '#ffd72d'
              }}
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