import React from 'react';
import { Layout, Row, Col } from 'antd';
const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer style={{
      backgroundColor: '#021529',
      color: 'white',
      padding: '48px 24px',
    }}>
      <Row gutter={[24, 24]}>
    
        <Col xs={24} sm={12} md={6}>
          <div style={{ 
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: 16,
            color: 'white'
          }}>
            Flowbite
          </div>
          <p style={{ color: '#a8a8a8' }}>
            Open-source library of interactive components.
          </p>
        </Col>

      
        <Col xs={24} sm={12} md={6}>
          <h3 style={{ color: 'white', marginBottom: 16 }}>Resources</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#a8a8a8' }}>
            <li style={{ marginBottom: 8 }}>Documentation</li>
            <li style={{ marginBottom: 8 }}>Components</li>
            <li style={{ marginBottom: 8 }}>Tutorials</li>
          </ul>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <h3 style={{ color: 'white', marginBottom: 16 }}>Company</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#a8a8a8' }}>
            <li style={{ marginBottom: 8 }}>About</li>
            <li style={{ marginBottom: 8 }}>Careers</li>
            <li style={{ marginBottom: 8 }}>Contact</li>
          </ul>
        </Col>

   
        <Col xs={24} sm={12} md={6}>
          <h3 style={{ color: 'white', marginBottom: 16 }}>Follow us</h3>
          <div style={{ color: '#a8a8a8' }}>
            <p style={{ marginBottom: 8 }}>GitHub</p>
            <p style={{ marginBottom: 8 }}>Twitter</p>
            <p style={{ marginBottom: 8 }}>LinkedIn</p>
          </div>
        </Col>
      </Row>


      <div style={{ 
        marginTop: 48,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        color: '#a8a8a8'
      }}>
        © {new Date().getFullYear()} Flowbite. All rights reserved.
      </div>
    </Footer>
  );
}

export default AppFooter;