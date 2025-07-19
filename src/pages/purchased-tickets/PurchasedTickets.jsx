import React, { useEffect, lazy, Suspense } from 'react';
import useAuthStore from '../../stores/authStore';
import useTicketStore from '../../stores/ticketStore';
import { Spin, Empty, Alert, Collapse, Typography, Anchor, Row, Col, Button, Result , ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import './purchased-ticket.css';
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
    fetchTickets
  } = useTicketStore();

  const navigate = useNavigate();

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

  if (authLoading || ticketsLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading your tickets..." />
      </div>
    );
  }

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
        subTitle="Looks like you haven’t grabbed any tickets yet. Browse upcoming events and secure your spot!"
        extra={<Button type="primary" href="/events">Browse Events</Button>}
      />
    );
  }

  if (Object.keys(ticketsByYear).length === 0) {
    return (
      <Result
        icon={<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="lightGray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-minus-icon lucide-ticket-minus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 12h6"/></svg>}
        title="No Tickets Purchased"
        subTitle="Looks like you haven’t grabbed any tickets yet. Browse upcoming events and secure your spot!"
        extra={<Button size="large" onClick={() => navigate('/')} className="backHome-button">Browse Events</Button>}
      />
    );
  }

  const yearItems = Object.keys(ticketsByYear).sort((a, b) => b - a);

  return (
    <Row gutter={24} className="purchased-tickets-container">
<Col flex="none" className="anchor">
  <ConfigProvider
    theme={{
      components: {
        Anchor: {
          colorPrimary: '#ffd72d', // Default yellow
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

        {yearItems.map((year) => (
          <div key={year} id={`year-${year}`} style={{ scrollMarginTop: 100 }}>
            <Title level={4}>{year}</Title>
            <div className="tickets-grid">
              <Suspense fallback={<Spin tip="Loading tickets..." />}>
                {ticketsByYear[year].map((ticket) => (
                  <Ticket key={ticket.id} ticket={ticket} />
                ))}
              </Suspense>
            </div>
          </div>
        ))}
      </Col>
    </Row>
  );
};

export default PurchasedTickets;
