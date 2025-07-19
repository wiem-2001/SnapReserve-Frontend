import React, { useEffect } from 'react';
import { 
  Typography, 
  Card,
  Divider,
  Tag,
  Row,
  Col,
  Space,
  Button,
  Spin,
  Alert,
  Image,
  List,
  Tooltip
} from 'antd';
import { 
  CheckCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TagOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import useTicketStore from '../../stores/ticketStore'; 
import './PaymentSuccess.css';
import '../../components/EventCard/EventCard.css';

const { Title, Text } = Typography;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const bounceScale = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id'); 
  const { orderDetails, loadingOrder, error, fetchOrderDetails, clearState } = useTicketStore();

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    }
    return () => clearState(); 
  }, [sessionId, fetchOrderDetails, clearState]);

  const totalTickets = orderDetails?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  if (loadingOrder) return <Spin tip="Loading order details..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!orderDetails) return null;

  return (
    <div className="payment-success-container">
      <motion.div
        initial="initial"
        animate="animate"
        variants={bounceScale}
        className="icon-wrapper"
      >
        <CheckCircleOutlined className="success-icon" />
      </motion.div>

      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Title level={2} className="main-title">
          Payment Successful!
        </Title>
      </motion.div>

      <Row justify="center" gutter={16} className="button-row">
        <Col>
          <Button
            size="large"
            onClick={() => navigate('/')}
            className="backHome-button"
          >
            Back to Home
          </Button>
        </Col>
        
        <Col>
          <Button
            size="large"
            onClick={() => navigate('/purchased-tickets')}
            className="viewTicket-button"
          >
            View My Tickets
          </Button>
        </Col>
      </Row>

      <Card className="order-card">
        <Title level={2} className="section-title">
          Order & Ticket Details
        </Title>

        <Card
          className="event-card"
          bodyStyle={{ padding: 0 }}
          cover={
            <div style={{ position: 'relative', height: 250 }}>
              <img
                alt={orderDetails.event.title}
                src={`${import.meta.env.VITE_API_URL}${orderDetails.event.image}`}
                crossOrigin="anonymous"
                className="event-card-image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(2, 21, 41, 0.85) 30%, rgba(2, 21, 41, 0.5) 100%)',
                color: '#ffd72d',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                
              }}>
                <Title level={1} style={{ margin: 0, color: '#ffd72d' }}>{orderDetails.event.title}</Title>
                <div style={{ marginTop: 8, fontSize: 16, display: 'flex', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined />
                   <span>
                    {orderDetails.event.dates.length > 1 
                      ? 'Multiple Dates' 
                      : new Date(orderDetails.event.dates[0].date).toLocaleString()}
                  </span>

                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EnvironmentOutlined />
                    <span>
                      {orderDetails.event.dates.length > 1 
                        ? 'Various Locations' 
                        : orderDetails.event.dates[0].location}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TagOutlined />
                    <span>{orderDetails.event.category}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        >
        </Card>
        <Title level={4} className="tickets-title">
          Your Tickets
        </Title>
        
        <Space direction="vertical" className="ticket-items" size="middle">
          {orderDetails.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
              className="ticket-item"
            >
              <div>
                <Text strong className="item-name">{item.name}</Text>{' '}
                <Tag className="item-quantity">x{item.quantity}</Tag>
              </div>
              <Text strong className="item-price">${(item.price * item.quantity).toFixed(2)}</Text>
            </motion.div>
          ))}
        </Space>

        <Divider className="section-divider" />

        <Row justify="space-between" align="middle" className="total-row">
          <Text strong className="total-label">Total Paid</Text>
          <Title level={3} className="total-amount">
            ${orderDetails.total.toFixed(2)}
          </Title>
        </Row>

        <Space direction="vertical" size="large" className="order-status">
          <p className="status-text-simple">
            Your payment has been successfully processed.
          </p>

          <p className="status-text-simple">
            <span className="highlighted-data">
              {totalTickets} ticket(s)
            </span>{' '}
            generated for your order.
          </p>

          <p className="status-text-simple">
            Order Date:{' '}
            <span className="highlighted-data">
              {new Date(orderDetails.date).toLocaleString()}
            </span>
          </p>


          <p className="status-text-simple">
            A confirmation email was sent to{' '}
            <span className="highlighted-data">
              {orderDetails.email}
            </span>.
          </p>
          
          <p className="status-text-simple">
            You can also check your tickets by clicking the "View My Tickets" button above or by checking your email.
          </p>
        </Space>

        <Divider className="section-divider" />

        <Text type="secondary" className="support-text " >
          Enjoy the Event!
        </Text>
      </Card>
    </div>
  );
}