import React, { useEffect, useState } from 'react';
import {
  UserOutlined,
  SlidersOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  BellOutlined,
  SettingOutlined,
  LineChartOutlined,
  CalendarOutlined,
  PlusOutlined,
  ToolOutlined,
  ContainerOutlined 
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './SidebarMenu.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

function SidebarMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedKey, setSelectedKey] = useState('1');
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    
    const routes = {
      '1': '/profile',
      '2': '/purchased-tickets',
      '3': '/preferences',
      '5': '/payment-info',
      '6': '/notifications',
      '7': '/account-settings',
      '8-1': '/manage-events',
      '8-2': '/create-event',
      '9': '/analytics',
      '10-1': '/profile',
      '10-2': '/account-settings',
    };

    navigate(routes[key] || '/profile');
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role || decoded?.user?.role;
        setRole(userRole);

        if (userRole === 'organizer') {
        setSelectedKey('8-1');
        setDefaultOpenKeys(['8', '10']); 
        } else {
          setSelectedKey('1');
          
        }
      } catch (err) {
        console.error('Invalid token');
      }
    }
  }, []);

  const TicketIcon = ({ selected }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={selected ? "#ffd72d" : "#021529"}
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
  );

  const attendeeItems = [
    {
      key: '1',
      icon: <UserOutlined className="sidebar-icon" style={{ color: selectedKey === '1' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Personal Information</span>,
    },
    {
      key: '2',
      icon: <TicketIcon selected={selectedKey === '2'} />,
      label: <span className="sidebar-label">Purchased Tickets</span>,
    },
    {
      key: '3',
      icon: <SlidersOutlined className="sidebar-icon" style={{ color: selectedKey === '3' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Preferences</span>,
    },
    {
      key: '5',
      icon: <CreditCardOutlined className="sidebar-icon" style={{ color: selectedKey === '5' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Payment Information</span>,
    },
    {
      key: '6',
      icon: <BellOutlined className="sidebar-icon" style={{ color: selectedKey === '6' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Notifications</span>,
    },
    {
      key: '7',
      icon: <SettingOutlined className="sidebar-icon" style={{ color: selectedKey === '7' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Account Settings</span>,
    },
  ];

  const organizerItems = [
    {
      key: '8',
      icon: <ContainerOutlined className="sidebar-icon" style={{ color: selectedKey.startsWith('8') ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Manage Events</span>,
      children: [
        {
          key: '8-1',
          icon: <CalendarOutlined className="sidebar-icon" style={{ color: selectedKey === '8-1' ? '#FF4081' : '#021529' }} />,
          label: <span className="sidebar-label">Upcoming Events</span>,
        },
        {
          key: '8-2',
          icon: <PlusOutlined className="sidebar-icon" style={{ color: selectedKey === '8-2' ? '#FF4081' : '#021529' }} />,
          label: <span className="sidebar-label">Create Event</span>,
        },
      ],
    },
    {
      key: '9',
      icon: <LineChartOutlined className="sidebar-icon" style={{ color: selectedKey === '9' ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Analytics</span>,
    },
    {
      key: '10',
      icon: <SettingOutlined className="sidebar-icon" style={{ color: selectedKey.startsWith('10') ? '#FF4081' : '#021529' }} />,
      label: <span className="sidebar-label">Settings</span>,
      children: [
        {
          key: '10-1',
          icon: <UserOutlined className="sidebar-icon" style={{ color: selectedKey === '10-1' ? '#FF4081' : '#021529' }} />,
          label: <span className="sidebar-label">Personal Info</span>,
        },
        {
          key: '10-2',
          icon: <ToolOutlined className="sidebar-icon" style={{ color: selectedKey === '10-2' ? '#FF4081' : '#021529' }} />,
          label: <span className="sidebar-label">Account Settings</span>,
        },
      ],
    },
  ];

  return (
    <div
      style={{
        marginTop: 24,
        padding: 0,
        backgroundColor: 'white',
        boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1), -4px 0 8px rgba(0, 0, 0, 0.1)',
        width: collapsed ? 80 : 250,
        transition: 'all 0.3s',
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: 'white' }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          
          className="sidebar-menu"
          style={{ backgroundColor: 'white', width: 250 }}
          items={role === 'organizer' ? organizerItems : attendeeItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </div>
  );
}

export default SidebarMenu;