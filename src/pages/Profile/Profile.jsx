import React, { useState, useEffect, useCallback } from 'react';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import {
  Avatar,
  Button,
  Input,
  DatePicker,
  Select,
  Typography,
  Form,
  Space,
  Divider,
  Upload,
  message,
  Layout,
  Spin,
  Modal
} from 'antd';
import { UserOutlined, UploadOutlined, CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import './Profile.css'; 
import useAuthStore from '../../stores/authStore';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

function Profile() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getMe, user: authUser, loading, updateProfile, updateImageProfil, updatePassword } = useAuthStore();
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        const userData = response.user; 
        form.setFieldsValue({
          fullName: userData?.full_name || '', 
          phone: userData?.phone || '',
          gender: userData?.gender || '',
          birth_date: userData?.birth_date ? moment(userData.birth_date) : null,
          email: userData?.email || '',
        });
      } catch (err) {
        console.error('Error loading user info:', err);
        message.error(err.response?.data?.message || 'Failed to load user data');
      }
    };
    fetchUser();
  }, [getMe, form]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const handleUpdate = useCallback(async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const profileData = {
        fullName: values.fullName, 
        phone: values.phone,
        gender: values.gender || null, 
        birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
      };
      await updateProfile(profileData);
      message.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      message.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  }, [updateProfile, isSubmitting]);

  const handleImageChange = useCallback(({ file }) => {
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return;
      }

      const preview = URL.createObjectURL(file);
      setNewAvatarFile(file);
      setPreviewUrl(preview);
      setIsPreviewModalVisible(true);
    }
  }, []);

  const handleConfirmImageUpload = useCallback(async () => {
    if (!newAvatarFile) return;
    try {
      await updateImageProfil(newAvatarFile);
      message.success({
        content: (
          <span>
            <CheckCircleFilled style={{ color: '#52c41a', marginRight: 8 }} />
            Profile picture updated successfully
          </span>
        ),
        duration: 3,
      });
      setIsPreviewModalVisible(false);
      setPreviewUrl(null);
      setNewAvatarFile(null);
      await getMe();
    } catch (err) {
      console.error('Image upload error:', err.response?.data || err.message);
      message.error({
        content: (
          <span>
            <ExclamationCircleFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
            {err.response?.data?.message || 'Failed to update profile picture'}
          </span>
        ),
        duration: 3,
      });
    }
  }, [newAvatarFile, updateImageProfil, getMe]);

  const handleCancelImageUpload = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setNewAvatarFile(null);
    setIsPreviewModalVisible(false);
  }, [previewUrl]);

  const handlePasswordUpdate = useCallback(async () => {
    setIsPasswordSubmitting(true);
    try {
      const values = await passwordForm.validateFields();
      await updatePassword(values);
      
      message.success({
        content: (
          <span>
            <CheckCircleFilled style={{ color: '#52c41a', marginRight: 8 }} />
            Password updated successfully!
          </span>
        ),
        duration: 3,
      });
      
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (err) {
      console.error('Password update error:', err.response?.data || err.message);
      message.error({
        content: (
          <span>
            <ExclamationCircleFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
            {err.response?.data?.message || 'Failed to update password'}
          </span>
        ),
        duration: 3,
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  }, [passwordForm, updatePassword]);

  const showPasswordConfirmModal = useCallback(async () => {
    try {
      await passwordForm.validateFields();
      setIsPasswordModalVisible(true);
    } catch (err) {
      console.log('Validation failed:', err);
    }
  }, [passwordForm]);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <SidebarMenu />
        <Layout.Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'white' }}>
      <SidebarMenu />
      <Layout.Content style={{ padding: '40px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
            {authUser?.user?.profile_image ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${authUser.user.profile_image}`}
                alt="Profile Avatar"
                crossOrigin="anonymous"
                style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ccc' }}
              />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#A9A9A9', border: '2px solid #ccc' }}
              />
            )}

            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
              accept="image/*"
            >
              <Button
                type="text"
                icon={<UploadOutlined />}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '50%',
                  padding: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              />
            </Upload>
          </div>
          <Modal
            title="Confirm Profile Picture"
            visible={isPreviewModalVisible}
            onOk={handleConfirmImageUpload}
            onCancel={handleCancelImageUpload}
            okText="Confirm"
            cancelText="Cancel"
            centered
            okButtonProps={{
    style: {
      backgroundColor: '#021529', 
      borderColor: '#021529',
      color: '#ffd72d',           
      fontWeight: 'bold',
    },
  }}
  cancelButtonProps={{
    style: {
      color: '#021529',
      borderColor: '#021529',
      fontWeight: 'bold',
    },}}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p>Do you want to use this as your new profile picture?</p>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ffd72d',
                  margin: '20px auto'
                }}
              />
            </div>
          </Modal>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            onFinishFailed={() => message.error('Please fill all required fields')}
          >
            <Form.Item 
              label="Full Name" 
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                disabled={!isEditing} 
                className={isEditing ? 'custom-input' : ''}
                style={!isEditing ? { color: 'rgba(0, 0, 0, 0.85)' } : {}}
              />
            </Form.Item>

            <Form.Item 
              label="Phone Number" 
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input 
                disabled={!isEditing} 
                className={isEditing ? 'custom-input' : ''}
                style={!isEditing ? { color: 'rgba(0, 0, 0, 0.85)' } : {}}
              />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <p style={{ display: 'flex', color: 'gray', fontWeight: 'lighter', marginTop: '0px' }}>
                This field cannot be modified
              </p>
              <Input 
                disabled 
                style={{ color: 'rgba(0, 0, 0, 0.85)' }}
                value={authUser?.user?.email}
              />
            </Form.Item>

            {authUser?.user?.role !== "organizer" && (
              <>
                <Form.Item 
                  label="Gender" 
                  name="gender"
                  rules={[{ required: true, message: 'Please select your gender' }]}
                  
                >
                  <Select 
                    disabled={!isEditing} 
                    className={isEditing ? 'custom-input' : ''}
                    
                  >
                    <Option value="male" >Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  label="Date of Birth" 
                  name="birth_date"
                  rules={[{ required: true, message: 'Please select your date of birth' }]}
                >
                  <DatePicker 
                    disabled={!isEditing} 
                    style={{ width: '100%' , color: 'rgba(0, 0, 0, 0.85)' } }
                    className={isEditing ? 'custom-datepicker' : ''}
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              {isEditing ? (
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    style={{
                      backgroundColor: '#ffd72d',
                      color: '#021529',
                      fontWeight: 'bold',
                    }}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Save
                  </Button>
                  <Button
                    shape="round"
                    style={{
                      backgroundColor: '#021529',
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Space>
              ) : (
                <Button
                  shape="round"
                  style={{
                    backgroundColor: '#021529',
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Update Information
                </Button>
              )}
            </Form.Item>
          </Form>

          <Divider />
          <Title level={4} style={{ textAlign: 'left' }}>
            Update Password
          </Title>
          
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={showPasswordConfirmModal}
          >
            <Form.Item 
              label="Current Password" 
              name="currentPassword"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item 
              label="New Password" 
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter a new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
                { pattern: /[A-Z]/, message: 'Must contain at least one uppercase letter' },
                { pattern: /[a-z]/, message: 'Must contain at least one lowercase letter' },
                { pattern: /[0-9]/, message: 'Must contain at least one number' },
                { pattern: /[^A-Za-z0-9]/, message: 'Must contain at least one special character' }
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                style={{
                  backgroundColor: '#021529',
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 'bold',
                }}
                loading={isPasswordSubmitting}
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="Confirm Password Change"
            visible={isPasswordModalVisible}
            onOk={handlePasswordUpdate}
            onCancel={() => setIsPasswordModalVisible(false)}
            okText="Confirm"
            cancelText="Cancel"
            confirmLoading={isPasswordSubmitting}
          >
            <p>Are you sure you want to change your password?</p>
          </Modal>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Profile;