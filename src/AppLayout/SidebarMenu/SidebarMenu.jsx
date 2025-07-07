import React from 'react';
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './SidebarMenu.css'; 


const { Sider } = Layout;

function SidebarMenu() {
  const [collapsed, setCollapsed] = React.useState(false);

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
  style={{
    backgroundColor: 'white',
  }}
>
<Menu
  mode="inline"
  defaultSelectedKeys={['1']}
  className="sidebar-menu"
  style={{ backgroundColor: 'white', width: 250 }}
  items={[
    {
      key: '1',
      icon: <UserOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Personal Information</span>,
    },
    {
      key: '2',
      icon: <CalendarOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Upcoming Events</span>,
    },
    {
      key: '3',
      icon: <HistoryOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Past Events</span>,
    },
    {
      key: '4',
      icon: <CreditCardOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Payment Information</span>,
    },
    {
      key: '5',
      icon: <BellOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Notifications</span>,
    },
    {
      key: '6',
      icon: <SettingOutlined className="sidebar-icon" />,
      label: <span className="sidebar-label">Account Settings</span>,
    },
  ]}
/>
<Menu 

  />
</Sider>

    </div>
  );
}

export default SidebarMenu;
