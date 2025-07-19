import React from 'react';
import Layout from 'antd/es/layout/layout';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import { Button, Result } from 'antd';
import '../Notifications/Notifications.css';


function Notifications() {
  return (
    <div>
     <Layout style={{ minHeight: '100vh', background: 'white' }}>
           <SidebarMenu />
           <Layout.Content style={{ padding: '40px 24px', background: '#fff' }}>
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
            </div>
            </Layout.Content>
        </Layout>
    </div>
  )
}

export default Notifications
