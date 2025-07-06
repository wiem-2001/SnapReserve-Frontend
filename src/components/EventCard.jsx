import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';

const EventCard = ({ event }) => {
  const [saved, setSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };

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
    >
      <Card
        style={{
          width: '100%',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #e1c71a',
          transition: 'all 0.3s ease',
          background: isHovered ? 'rgba(255, 255, 255, 0.7)' : '#fff',
          position: 'relative'
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
            src={event.image}
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
       
        <div style={{ 
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: '#021529',
          color: '#ffd72d',
          padding: '4px 8px',
          borderRadius: 4,
          fontWeight: 'bold',
          zIndex: 2
        }}>
          ${event.priceRange[0]}+
        </div>

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

        <h3 style={{ 
          margin: '8px 0 0 0',
          fontSize: 16,
          flex: 1,
          transition: 'color 0.3s ease',
          color: isHovered ? '#021529' : 'inherit'
        }}>
          {event.title}
        </h3>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#666' }} />
            <span style={{ fontSize: 12 }}>{event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ marginRight: 8, color: '#666' }} />
            <span style={{ fontSize: 12 }}>{event.location}</span>
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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                color:'#ffd72d'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Book Now
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};


const CountdownTimer = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 'bold' }}>TIME REMAINING</div>
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        fontSize: 18,
        fontWeight: 'bold'
      }}>
        <span>5d</span>
        <span>12h</span>
        <span>30m</span>
      </div>
    </div>
  );
};


const EventList = () => {
  const events = [
    {
      id: 1,
      title: 'Wonder Girls 2010 World Tour',
      date: 'June 15, 2023',
      location: 'San Francisco',
      priceRange: [89],
      image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  
  ];

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 24,
      padding: 24
    }}>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;