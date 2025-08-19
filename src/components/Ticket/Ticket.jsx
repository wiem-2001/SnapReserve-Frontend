import React, { useState, useRef } from 'react';
import './Ticket.css';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import useTicketStore from '../../stores/ticketStore';
import { Tag, Spin, message } from 'antd';
import RefundTypeTag  from '../../components/RefundTypeTag';
const Ticket = ({ ticket, onProcessingChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const ticketRef = useRef(null);
  const { error, loading, requestRefund } = useTicketStore();

  if (!ticket) return null;

  const eventDate = new Date(ticket.date);
  const month = format(eventDate, 'MMM').toUpperCase();
  const day = format(eventDate, 'd');

  const handleDownloadImage = async () => {
    setShowMenu(false);
    if (!ticketRef.current) return;
    
    const statusBanner = ticketRef.current.querySelector('.ticket-status-banner');
    const statusTag = statusBanner ? statusBanner.querySelector('.ant-tag:last-child') : null;
  
    if (statusTag) {
      statusTag.style.display = 'none';
    }
    
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

  const openRefundModal = () => {
    setShowMenu(false);
    setRefundModalVisible(true);
  };

  const handleConfirmRefund = async () => {
    onProcessingChange(true);
    try {
      await requestRefund(ticket.id); 
      message.success(`Refund request submitted for ${ticket.event?.title}`);
      setRefundModalVisible(false);
    } catch (err) {
      console.error('Refund error:', err);
      message.error(err.message || 'Failed to process refund');
    } finally {
      onProcessingChange(false);
    }
  };

  const getRefundStatusTag = () => {
    switch(ticket.refundStatus) {
      case 'PROCESSED':
        return <Tag color="green">Refund Processed</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="ticket-card" ref={ticketRef}>
      {loading && (
        <div className="ticket-loading-overlay">
          <Spin size="large" tip="Processing refund..." />
        </div>
      )}

      <div className="ticket-header">
        <div className="header-shine"></div>
        <h2>{ticket.event?.title || 'Event Title'}</h2>
        <div className="ticket-menu">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-button">⋮</button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={handleDownloadImage}>Download Ticket</button>
              <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '8px 0' }}></div>
              <button onClick={openRefundModal}>Request Refund</button>
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
        <div className="ticket-status-banner">
          <RefundTypeTag 
            refundType={ticket.tier?.refundType} 
            refundPercentage={ticket.tier?.refundPercentage} 
          />
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
            <img src={ticket.qrCodeUrl} alt="QR Code" className="qr-code" />
            <p className="scan-hint">Scan for entry</p>
          </div>
        )}
      </div>

      <ConfirmModal
        visible={refundModalVisible}
        onConfirm={handleConfirmRefund}
        onCancel={() => {
          setRefundModalVisible(false);
          useTicketStore.getState().resetRefundStatus();
        }}
        title="Confirm Refund"
        confirmText={loading ? "Processing..." : "Submit Refund"}
        cancelText="Cancel"
        loading={loading}
        error={error}
      >
        <div className="refund-content">
          <p>You're requesting a refund for:</p>
          <div className="refund-details">
            <p><strong>Event:</strong> {ticket.event?.title}</p>
            <p><strong>Ticket Type:</strong> {ticket.tier?.name}</p>
            <p><strong>Amount:</strong> ${ticket.tier?.price?.toFixed(2)}</p>
          </div>
          
          {ticket.tier?.refundType !== "NO_REFUND" && (
            <div className="refund-policy">
              <p><strong>Refund Policy:</strong></p>
              {ticket.tier?.refundType === "FULL_REFUND" && (
                <p>Full refund available until {ticket.tier?.refundDays} days before event</p>
              )}
              {ticket.tier?.refundType === "PARTIAL_REFUND" && (
                <p>{ticket.tier?.refundPercentage}% refund until {ticket.tier?.refundDays} days before event</p>
              )}
            </div>
          )}
        </div>
      </ConfirmModal>
    </div>
  );
};

export default Ticket;