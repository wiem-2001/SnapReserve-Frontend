import React from 'react';
import './Ticket.css';
import { format } from 'date-fns';
import { useState , useRef } from 'react';
import html2canvas from 'html2canvas';

const Ticket = ({ ticket }) => {
  const [showMenu, setShowMenu] = useState(false);
  const ticketRef = useRef(null);
  if (!ticket) return null;

  const eventDate = new Date(ticket.date);
  const month = format(eventDate, 'MMM').toUpperCase();
  const day = format(eventDate, 'd');


  const handleDownloadImage = async () => {
    setShowMenu(false);
    if (!ticketRef.current) return;
     await new Promise(resolve => setTimeout(resolve, 100)); 
    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `ticket_${ticket.uuid}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="ticket-card" ref={ticketRef}>
      <div className="ticket-header">
        <div className="header-shine"></div>
        <h2>{ticket.event?.title || 'Event Title'}</h2>
         <div className="ticket-menu">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-button">⋮</button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={handleDownloadImage}>Download Ticket as an Image</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="ticket-body">
        <div className="event-date">
          <div className="date-badge">
            <span className="month">{month}</span>
            <span className="day">{day}</span>
          </div>
          <div className="date-info">
            <h3>{format(eventDate, 'MMMM d, yyyy')}</h3>
            <p>Time: <strong>{format(eventDate, 'h:mm a')}</strong></p>
          </div>
        </div>
        
        <div className="event-venue">
          <p className="section-label">Venue</p>
          <h4>{ticket.event?.dates?.[0]?.location || 'Location not specified'}</h4>
          <p>{ticket.event?.dates?.[0]?.location ? '' : 'Address not available'}</p>
        </div>
        
        <div className="ticket-details">
          <div className="price">
            <p className="section-label">Price</p>
            <h3>${ticket.tier?.price?.toFixed(2) || '0.00'}</h3>
          </div>
          <div className="ticket-number">
            <p>Ticket No. <span>{ticket.uuid?.split('-')[0] || 'N/A'}</span></p>
          </div>
        </div>
      </div>
      
      <div className="ticket-footer">
        <div className="perforation">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="perf-dot"></span>
          ))}
        </div>
        {ticket.qrCodeUrl && (
          <div className="qr-container">
            <img 
              src={ticket.qrCodeUrl} 
              alt="QR Code" 
              className="qr-code"
            />
            <p className="scan-hint">Scan for entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;