import React, { useState } from 'react';
import { Menu, Dropdown, Button, Space, Avatar, Badge } from 'antd';
import { LogoutOutlined , UserOutlined, DownOutlined  } from '@ant-design/icons';
import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import {jwtDecode} from 'jwt-decode'; 
import './Header.css'; 
const menuItems = [
  { key: 'home', label: 'UpComming events', path: '/' },
  { key: 'Recommended', label: 'Recommended for You', path: '/Recommended' },
  { key: 'resell', label: 'Resell Tickets', path: '/resell' },
  { key: 'deals', label: 'Deals', path: '/deals' },
];

function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname.substring(1) || 'home');
  const token = useAuthStore(state => state.token); 
  const logout = useAuthStore(state => state.logout);
  const [fullName, setFullName] = useState(null);
  const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setFullName(decoded.fullName || decoded.email);
            setUserRole(decoded.role || null);
          } catch (err) {
            console.error('Invalid token:', err);
            setFullName(null);
            setUserRole(null);
          }
        } else {
          setFullName(null);
          setUserRole(null);
        }
      }, [token]);
      const onMenuClick = (e) => {
        setCurrent(e.key);
        const item = menuItems.find(m => m.key === e.key);
        if (item) navigate(item.path);
      };

      const userMenu = (
      <Menu
    onClick={({ key }) => {
      if (key === 'logout') {
        logout();
        navigate('/login');
      } else {
        navigate(`/${key}`);
      }
    }}
  >
    <Menu.Item key="profile" icon={<UserOutlined style={{ color: '#021529' }} />}>
      My Profile
    </Menu.Item>

 {userRole == 'attendee' && (      <Menu.Item key="tickets" icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#021529"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ verticalAlign: 'middle' }}
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
    }>
      Purchased Tickets
    </Menu.Item>
         )}

    <Menu.Item key="logout" icon={<LogoutOutlined  style={{ color: '#021529' }} />}>
      Logout
    </Menu.Item>
  </Menu>
      );

  return (
    <div style={{ backgroundColor: '#021529', }} >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 82,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
        position: 'relative',
        zIndex: 1000,
        
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'white',
          cursor: 'pointer',
          
        }} onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" style={{ height: 60, marginRight: 12 }} />
          SnapReserve
        </div>

      {userRole !== 'organizer' && (        <Menu 
          onClick={onMenuClick}
          selectedKeys={[current]}
          theme="dark"
          mode="horizontal"
          items={menuItems}
          style={{
            flex: 1,
            justifyContent: 'center',
            background: 'transparent',
            borderBottom: 'none',
          }}
        />
        )}

        <Space size="large" style={{ color: 'white' }}>
        {token   ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           
                
              
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Button type="text" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    size={40} 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#021529', color: 'white' }}
                  />
                  <span style={{ marginLeft: 8 }}>{fullName}</span>
                  <DownOutlined style={{ marginLeft: 8 }} />
                </Button>
              </Dropdown>
            </div>

          </div>
            
          ) : (
            <Space size="middle">
             
              <Button
                type="primary"
                shape="round"
                style={{
                  backgroundColor: '#ffd72d',
                  borderColor: '#021529',
                  marginTop: 16,
                  fontWeight: 'bold',
                  color: '#021529',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/signUp');
                }}
              >
                Sign Up
              </Button>

              <Button
                type="primary"
                shape="round"
                style={{
                  backgroundColor: '#021529',
                  borderColor: 'white',
                  marginTop: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login');
                }}
              >
                Sign In
              </Button>

            </Space>
          )}
        </Space>
      </div>
    </div>
  );
}

export default Header;