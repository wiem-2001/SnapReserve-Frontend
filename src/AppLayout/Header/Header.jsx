import React, { useState, useEffect } from 'react';
import {
  Menu,
  Dropdown,
  Button,
  Space,
  Avatar,
  Badge,
  Empty,
  List,
  Typography,
} from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  BellOutlined,
  HeartOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import logo from '../../assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore'; 
import {jwtDecode} from 'jwt-decode';
import './Header.css';
import { format } from 'date-fns';
const { Text } = Typography;

const menuItems = [
  { key: 'home', label: 'UpComming events', path: '/' },
  { key: 'favorites', label: 'Favorites', path: '/favorites' },
  { key: 'points-dashboard', label: 'Ticket Rewards', path: '/points-dashboard' },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname.substring(1) || 'home');
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [fullName, setFullName] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

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
    }
  }, [token]);

  const onMenuClick = (e) => {
    setCurrent(e.key);
    const item = menuItems.find((m) => m.key === e.key);
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
          Account
      </Menu.Item>
      <Menu.Item key="points-dashboard" icon={<DashboardOutlined  style={{ color: '#021529' }} />}>
       Ticket Rewards
      </Menu.Item>

      {userRole === 'attendee' && (
        <Menu.Item
          key="purchased-tickets"
          icon={
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
          }
        >
          Purchased Tickets
        </Menu.Item>
      )}
     {userRole !== 'organizer' && (  <Menu.Item key="favorites" icon={<HeartOutlined style={{ color: '#021529' }} />}>
        Favorites
      </Menu.Item>)}

      <Menu.Item key="logout" icon={<LogoutOutlined style={{ color: '#021529' }} />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markAsRead(notif.id);
    }
  };

  const notificationDropdown = (
    <div className="dropdown-card" style={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
      {notifications.length === 0 ? (
        <Empty
          description="You're all caught up!"
          image={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="lightgray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell-off"
            >
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
              <path d="M6.26 6.26A17.89 17.89 0 0 0 6 8c0 3.07-1.63 5.64-4 7" />
              <path d="M18 8a6 6 0 0 0-9.33-5" />
              <path d="M2 2l20 20" />
            </svg>
          }
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(notif) => (
            <List.Item
              style={{
                backgroundColor: notif.read ? 'white' : '#fffbe6',
                cursor: 'pointer',
                padding: '10px 16px',
              }}
              onClick={() => handleNotificationClick(notif)}
            >
              <List.Item.Meta
                description={
                  <div>
                    <Text style={{ color: 'black', display: 'block' }}>
                      {notif.message || notif.body}
                    </Text>
                    <small style={{ color: 'gray' }}>
                      {format(new Date(notif.createdAt), 'yyyy-MM-dd HH:mm')}
                    </small>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <div className="header-container">
      <div className="header-inner">
        {userRole !== 'organizer' ? ( <div className="logo-section" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo-image" />
          SnapReserve
        </div>):( <div className="logo-section" onClick={() => navigate('/manage-events')}>
          <img src={logo} alt="Logo" className="logo-image" />
          SnapReserve
        </div>)}
        {userRole !== 'organizer' && (
          <Menu
            onClick={onMenuClick}
            selectedKeys={[current]}
            theme="dark"
            mode="horizontal"
            items={menuItems}
            style={{ flex: 1, justifyContent: 'center', background: 'transparent', borderBottom: 'none' }}
          />
        )}

        <Space size="large" className="header-right-section">
          {token ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Dropdown overlay={notificationDropdown} trigger={['click']} placement="bottomRight">
                  <Badge count={unreadCount} offset={[-2, 2]} size="small" showZero>
                    <Button
                      shape="circle"
                      type="text"
                      icon={<BellOutlined />}
                      className="notification-button"
                    />
                  </Badge>
                </Dropdown>
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <Button type="text" className="avatar-button">
                    <Avatar size={40} icon={<UserOutlined />} className="avatar-style" />
                    <span className="fullName">{fullName}</span>
                    <DownOutlined className="downOutlined" />
                  </Button>
                </Dropdown>
              </div>
            </div>
          ) : (
            <Space size="middle">
              <Button
                type="primary"
                shape="round"
                className="signup-button"
                onClick={() => navigate('/signUp')}
              >
                Sign Up
              </Button>
              <Button
                type="primary"
                shape="round"
                className="signin-button"
                onClick={() => navigate('/login')}
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
