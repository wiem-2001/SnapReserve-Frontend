import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Title } = Typography;

function AppFooter() {
  return (
    <Footer style={{
      backgroundColor: '#021529',
      color: 'white',
      padding: '48px 24px',
    }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: 16,
            color: 'white'
          }}>
            SnapReserve
          </div>
          <Text style={{ color: '#a8a8a8' }}>
            Your premier platform for discovering, creating, and managing events. 
            Connect with audiences and create unforgettable experiences.
          </Text>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: 16 }}>For Attendees</Title>
          <ul style={{ listStyle: 'none', padding: 0, color: '#a8a8a8' }}>
            <li style={{ marginBottom: 8 }}>Browse Events</li>
            <li style={{ marginBottom: 8 }}>Purchase Tickets</li>
            <li style={{ marginBottom: 8 }}>Resell Tickets</li>
            <li style={{ marginBottom: 8 }}>Manage My Tickets</li>
          </ul>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: 16 }}>For Organizers</Title>
          <ul style={{ listStyle: 'none', padding: 0, color: '#a8a8a8' }}>
            <li style={{ marginBottom: 8 }}>Create Events</li>
            <li style={{ marginBottom: 8 }}>Manage Events</li>
            <li style={{ marginBottom: 8 }}>Analytics & Reports</li>
            <li style={{ marginBottom: 8 }}>Organizer Resources</li>
          </ul>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: 16 }}>Contact Us</Title>
          <div style={{ color: '#a8a8a8' }}>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <MailOutlined style={{ marginRight: 8 }} />
              <span>support@eventflow.com</span>
            </div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <PhoneOutlined style={{ marginRight: 8 }} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              <span>123 Event Street, City, Country</span>
            </div>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <Title level={5} style={{ color: 'white', marginBottom: 12 }}>Follow Us</Title>
            <div style={{ display: 'flex', gap: '16px' }}>
              <FacebookOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }} />
              <TwitterOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }} />
              <InstagramOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }} />
              <LinkedinOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer' }} />
            </div>
          </div>
        </Col>
      </Row>
      
      <div style={{ 
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        color: 'white'
      }}>
        
      </div>
    </Footer>
  );
}

export default AppFooter;