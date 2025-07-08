import React, { useState } from 'react';
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
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import './Profile.css'; 
const { Title } = Typography;
const { Option } = Select;

function Profile({ user }) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null); 

  const handleUpdate = (values) => {
    console.log('Updated values:', values);
    setIsEditing(false);

  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(info.file.originFileObj);
      message.success('Profile picture updated!');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh',background: 'white' }}>
      <SidebarMenu />
      <Layout.Content style={{ padding: '40px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
            <Avatar
                size={120}
                src={avatarUrl}
                icon={!avatarUrl && <UserOutlined />}
                style={{
                border: '2px solid',
                backgroundColor: '#A9A9A9',
                }}
            />
            <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
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
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                  fullName: user?.fullName || '',
                  phone: user?.phone || '',
                  gender: user?.gender || '',
                  dob: user?.dob ? moment(user.dob) : null,
                  email: user?.email || '',
                }}
                onFinish={handleUpdate}
              >
              <Form.Item label="Full Name" name="fullName" className={isEditing ? 'custom-input' : ''}>
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Phone Number" name="phone" className={isEditing ? 'custom-input' : ''}>
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Email" name="email">
              <p style={{display:'flex',color:'gray',fontWeight:'lighter',marginTop:'0px'}}>this field can not be modified</p>
                <Input disabled />
              </Form.Item>

              {user?.role == 'organizer' && (
                <>
                  <Form.Item label="Gender" name="gender" className={isEditing ? 'custom-input' : ''}>
                    <Select disabled={!isEditing}>
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Date of Birth" name="dob" className={isEditing ? 'custom-datepicker' : ''}>
                    <DatePicker disabled={!isEditing} style={{ width: '100%' }} />
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
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item label="Current password" name="cureentPassword" className="custom-input" >
              <Input placeholder='Enter your current password' 
              />
            </Form.Item>
            <Form.Item label="password" name="password" className="custom-input">
              <Input placeholder='New password' />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPassword" className="custom-input">
              <Input placeholder='Retype new password' />
            </Form.Item>

            <Form.Item>
                <Space>
                  <Button
                    shape="round"
                    style={{
                      backgroundColor: '#021529',
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 'bold',
                      
                    }}
                  >
                    update Password
                  </Button>
                </Space>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
    </Layout>
  );
}

export default Profile;
