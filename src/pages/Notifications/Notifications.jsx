import React, { useEffect } from 'react';
import Layout from 'antd/es/layout/layout';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import { Button, Result, Spin } from 'antd';
import '../Notifications/Notifications.css';
import useNotif from '../../stores/notificationStore';


function Notifications() {
  const { notifications, loading, fetchNotifications } = useNotif();
  useEffect(() => {
    fetchNotifications(); 
  }, [fetchNotifications]);

  return (
    <div>
     <Layout style={{ minHeight: '100vh', background: 'white' }}>
           <SidebarMenu />
           <Layout.Content style={{ padding: '40px 24px', background: '#fff' }}>
             {loading ? (
                <Spin size="large" />
             ): notifications.length === 0 ? (
             <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
               <Result
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
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
                  title="No Notifications Yet"
                  subTitle="You're all caught up! When something important happens, you'll see it here."
                  extra={
                    <Button className='explore-event-btn' onClick={() => navigate('/events')}>
                      Explore Events
                    </Button>
                  }
                />
            </div>) : (
              <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem' }}>Notifications</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    backgroundColor: notif.read ? '#f9f9f9' : '#fffbe6',
                  }}
                >
                  <strong>{notif.message}</strong>
                  <br />
                  <small>{new Date(notif.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          </div>
            )
            }
            </Layout.Content>
        </Layout>
    </div>
  )
}

export default Notifications
