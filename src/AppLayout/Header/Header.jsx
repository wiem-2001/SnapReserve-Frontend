import React, { useState } from 'react';
import { Menu, Dropdown, Button, Space, Avatar, Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import {jwtDecode} from 'jwt-decode'; 
import './Header.css'; 
const menuItems = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'events', label: 'Events', path: '/events' },
  { key: 'resell', label: 'Resell Tickets', path: '/resell' },
  { key: 'deals', label: 'Deals', path: '/deals' },
];

function Header() {
  const cartCount = 3;
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname.substring(1) || 'home');
  const token = useAuthStore(state => state.token); 
  const logout = useAuthStore(state => state.logout);
  const [fullName, setFullName] = useState(null);
    useEffect(() => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setFullName(decoded.fullName || decoded.email);
          } catch (err) {
            console.error('Invalid token:', err);
            setFullName(null);
          }
        } else {
          setFullName(null);
        }
      }, [token]);
      const onMenuClick = (e) => {
        setCurrent(e.key);
        const item = menuItems.find(m => m.key === e.key);
        if (item) navigate(item.path);
      };
      useEffect(() => {
        console.log('Auth token:', token);
        console.log('User data:', fullName);
      }, [token]);

  const userMenu = (
    <Menu onClick={({ key }) => {
      if (key === 'logout') {
        logout();
        navigate('/login');
      } else {
        navigate(`/${key}`);
      }
    }}>
      <Menu.Item key="profile">My Profile</Menu.Item>
      <Menu.Item key="tickets">My Tickets</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ backgroundColor: '#021529' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 82,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'white',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" style={{ height: 60, marginRight: 12 }} />
          SnapReserve
        </div>

        <Menu 
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

        <Space size="large" style={{ color: 'white' }}>
         

        {token   ? (
          <div>
             <Badge count={cartCount} size="small">
            <ShoppingCartOutlined 
              style={{ fontSize: 30, color: 'white', cursor: 'pointer' }} 
              onClick={() => navigate('/cart')}
            />
          </Badge>
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