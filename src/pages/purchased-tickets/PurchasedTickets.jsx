import React, { useEffect, lazy, Suspense, useState } from 'react';
import useAuthStore from '../../stores/authStore';
import useTicketStore from '../../stores/ticketStore';
import { Spin, Alert, Collapse, Typography, Anchor, Row, Col, Button, Result, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../purchased-tickets/purchased-ticket.css';
import '../PaymentSuccess/PaymentSuccess.css';

const { Panel } = Collapse;
const { Title } = Typography;
const Ticket = lazy(() => import('../../components/Ticket/Ticket'));

const PurchasedTickets = () => {
  const { user: authUser, loading: authLoading, error: authError, getMe } = useAuthStore();
  const {
    ticketsByYear,
    loading: ticketsLoading,
    error: ticketsError,
    fetchTickets,
  } = useTicketStore();

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await getMe();
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
    loadUser();
  }, [getMe]);

  useEffect(() => {
    if (authUser?.user?.id) {
      fetchTickets(authUser.user.id);
    }
  }, [authUser?.user?.id, fetchTickets]);

  const isLoading = authLoading || ticketsLoading || isProcessing;

  if (authError) {
    return (
      <Alert
        message="Authentication Error"
        description={authError}
        type="error"
        showIcon
        className="error-alert"
      />
    );
  }

  if (ticketsError) {
    return (
      <Alert
        message="Ticket Loading Error"
        description={ticketsError}
        type="error"
        showIcon
        className="error-alert"
      />
    );
  }

  if (!authUser?.user) {
    return (
      <Result
        icon={<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="lightGray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-minus-icon lucide-ticket-minus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 12h6"/></svg>}
        title="No Tickets Purchased"
        subTitle="Looks like you haven't grabbed any tickets yet. Browse upcoming events and secure your spot!"
        extra={<Button type="primary" href="/events">Browse Events</Button>}
      />
    );
  }

  if (Object.keys(ticketsByYear).length === 0 && !isLoading) {
    return (
      <Result
        icon={<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="lightGray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-minus-icon lucide-ticket-minus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 12h6"/></svg>}
        title="No Tickets Purchased"
        subTitle="Looks like you haven't grabbed any tickets yet. Browse upcoming events and secure your spot!"
        extra={<Button size="large" onClick={() => navigate('/')} className="backHome-button">Browse Events</Button>}
      />
    );
  }

  const yearItems = Object.keys(ticketsByYear).sort((a, b) => b - a);

  return (
    <>
      <div className={isLoading ? 'blur-content' : ''}>
        <Row gutter={24} className="purchased-tickets-container">
          <Col flex="none" className="anchor">
            <ConfigProvider
              theme={{
                components: {
                  Anchor: {
                    colorPrimary: '#ffd72d',
                  },
                },
              }}
            >
              <Anchor
                direction="vertical"
                offsetTop={100}
                className="custom-anchor"
                items={yearItems.map((year) => ({
                  key: `year-${year}`,
                  href: `#year-${year}`,
                  title: year,
                }))}
              />
            </ConfigProvider>
          </Col>

          <Col flex="auto">
            <Title level={2} className="page-title">Your Tickets</Title>
            <Alert
              message="Refund & Cancellation Policy"
              description={
                <div style={{ fontSize: 12 }}>
                  <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                    <li><strong>Full Refund</strong> – 100% ticket price refunded.</li>
                    <li><strong>Partial Refund</strong> – Part of the ticket price refunded.</li>
                    <li><strong>Non-refundable</strong> – No refund available.</li>
                  </ul>
                  <p style={{ marginTop: 4, fontSize: 12 }}>
                    Refund eligibility is set by the event organizer and displayed in your ticket details.
                  </p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24, backgroundColor: '#fffbe6', borderColor: '#ffe58f' }}
            />
            {yearItems.map((year) => (
              <div key={year} id={`year-${year}`} style={{ scrollMarginTop: 100 }}>
                <Title level={4}>{year}</Title>
                <div className="tickets-grid">
                  <Suspense fallback={
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Spin size="large" tip="Loading ticket details..." />
                    </div>
                  }>
                    {ticketsByYear[year].map((ticket) => (
                      <Ticket 
                        key={ticket.id} 
                        ticket={ticket} 
                        onProcessingChange={setIsProcessing} 
                      />
                    ))}
                  </Suspense>
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </div>

      {isLoading && (
        <div className={`loading-overlay ${isProcessing ? 'active' : ''}`}>
          <Spin size="large" tip={authLoading || ticketsLoading ? "Loading your tickets..." : "Processing..."} />
        </div>
      )}
    </>
  );
};

export default PurchasedTickets;