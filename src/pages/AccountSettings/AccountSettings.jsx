import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Layout, 
  List, 
  Avatar, 
  Tag, 
  Button,
  message
} from 'antd';
import { HistoryOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from '../../AppLayout/Header/Header';
import AppFooter from '../../AppLayout/Footer';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import { format } from 'date-fns';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'; 
import useAuthStore from '../../stores/authStore'; 
import toast from 'react-hot-toast';

function AccountSettings() {
  const navigate = useNavigate();
  const deleteUser = useAuthStore((state) => state.deleteUser);
  const fetchUserDevices = useAuthStore((state) => state.fetchUserDevices);
  const devices = useAuthStore((state) => state.devices);
  
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);  

const handleDeleteAccount = async () => {
  setLoading(true);
  try {
    await deleteUser();
    toast.success('Account has been deleted');
    setDeleteModalVisible(false);
    navigate('/');
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.message || 'Failed to delete account');
    setDeleteModalVisible(false);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchUserDevices();
  }, [fetchUserDevices]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);  
  };

  return (
    <div>
      <Header />
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <SidebarMenu />
        <Layout.Content style={{ padding: '24px', background: '#fff' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
         
            <Card 
              title="Recent Activity" 
              className="settings-card"
              style={{ marginBottom: 24 }}
            >
              <List
                itemLayout="horizontal"
                dataSource={devices.slice(0, visibleCount)}  
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<HistoryOutlined />} />}
                      title="Device used"
                      description={
                        <>
                          <span>
                            {format(new Date(item.lastUsed), 'yyyy-MM-dd HH:mm:ss')}
                          </span>
                          {item.device && (
                            <Tag style={{ marginLeft: 8 }}>{item.friendlyDevice}</Tag>
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                {visibleCount < devices.length && (
                  <Button type="link" onClick={handleLoadMore}>
                    View More Activity
                  </Button>
                )}
                {visibleCount >= devices.length && devices.length > 0 && (
                  <div>No more activity</div>
                )}
              </div>
            </Card>

            <Card 
              className="danger-zone-card"
              style={{ border: '1px solid #ff4d4f' }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <DeleteOutlined style={{ 
                    color: '#ff4d4f', 
                    fontSize: 20,
                    marginTop: 4
                  }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>Delete Account</div>
                    <div style={{ color: '#666', fontSize: 13 }}>
                      Permanently delete your account and all associated data. This cannot be undone.
                    </div>
                  </div>
                </div>
                <Button 
                  danger 
                  onClick={() => setDeleteModalVisible(true)}
                  loading={loading}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </Layout.Content>
      </Layout>
      <AppFooter />

 
      <ConfirmModal
        visible={isDeleteModalVisible}
        title="Permanently Delete Your Account?"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      >
        <p>This action cannot be undone. All your data will be permanently deleted.</p>
        <p style={{ color: '#ff4d4f', marginTop: 8 }}>
          Note: If you have events with tickets that have been sold, 
          you won't be able to delete your account until those events are completed.
        </p>
      </ConfirmModal>
    </div>
  );
}

export default AccountSettings;
