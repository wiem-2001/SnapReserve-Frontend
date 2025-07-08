import React from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Typography,
  Divider
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../Profile/Profile.css';
import Header from '../../appLayout/Header/Header';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import AppFooter from '../../appLayout/Footer';
import { Layout } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

function CreateEvent({
  formData = {
    title: '',
    category: '',
    description: '',
    image: '',
    maxCapacity: '',
    dates: [{ date: '', location: '' }],
    pricingTiers: [{ ageGroup: '', price: '' }]
  },
  handleChange,
  handleSubmit,
  handleDateChange,
  handlePricingChange,
  addDateLocation,
  removeDateLocation,
  addPricingTier,
  removePricingTier,
  errors = {},
  categories = []
}) {
  return (
  <div>
        <Header/>
        
        <Layout style={{ minHeight: '100vh',background: 'white' }}>
            <SidebarMenu />
            <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '50px',
                    marginBottom: '10px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                    My Upcoming Events
                    </h2>
                  
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto' }}></div>

                <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                  <Form.Item
                    label="Event Title"
                    validateStatus={errors.title ? 'error' : ''}
                    help={errors.title}
                    className="custom-input"
                  >
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Event Title"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Category"
                    validateStatus={errors.category ? 'error' : ''}
                    help={errors.category}
                    className="custom-input"
                  >
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={value => handleChange({ target: { name: 'category', value } })}
                      placeholder="Select Category"
                    >
                      {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    validateStatus={errors.description ? 'error' : ''}
                    help={errors.description}
                    className="custom-input"
                  >
                    <TextArea
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Event Description"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Image URL"
                    validateStatus={errors.image ? 'error' : ''}
                    help={errors.image}
                    className="custom-input"
                  >
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Event Image URL"
                      
                    />
                  </Form.Item>

                  <Form.Item
                    label="Maximum Capacity"
                    validateStatus={errors.maxCapacity ? 'error' : ''}
                    help={errors.maxCapacity}
                    className="custom-input"
                  >
                    <Input
                      type="number"
                      name="maxCapacity"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      placeholder="Maximum Capacity"
                      min={1}
                    />
                  </Form.Item>

                  <Divider />
                  <Typography.Title level={5}>Dates & Locations</Typography.Title>

                  {formData.dates.map((dateObj, i) => (
                    <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <DatePicker
                        value={dateObj.date ? moment(dateObj.date) : null}
                        onChange={date => handleDateChange(i, 'date', date?.format('YYYY-MM-DD'))}
                        className="custom-datepicker"
                      />
                      <Input
                        placeholder="Location"
                        value={dateObj.location}
                        onChange={e => handleDateChange(i, 'location', e.target.value)}
                        className="custom-input"
                      />
                      {formData.dates.length > 1 && (
                        <MinusCircleOutlined onClick={() => removeDateLocation(i)} />
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={addDateLocation}
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                    >
                      Add Date & Location
                    </Button>
                    {errors.dates && <div className="createevent-error-message">{errors.dates}</div>}
                  </Form.Item>

                  <Divider />
                  <Typography.Title level={5}>Pricing Tiers</Typography.Title>

                  {formData.pricingTiers.map((priceObj, i) => (
                    <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Input
                        placeholder="Age Group (e.g. Adult)"
                        value={priceObj.ageGroup}
                        onChange={e => handlePricingChange(i, 'ageGroup', e.target.value)}
                        className="custom-input"
                      />
                      <Input
                        type="number"
                        placeholder="Price ($)"
                        value={priceObj.price}
                        onChange={e => handlePricingChange(i, 'price', e.target.value)}
                        className="custom-input"
                        min={0}
                      />
                      {formData.pricingTiers.length > 1 && (
                        <MinusCircleOutlined onClick={() => removePricingTier(i)} />
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={addPricingTier}
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                    >
                      Add Pricing Tier
                    </Button>
                    {errors.pricingTiers && <div className="createevent-error-message">{errors.pricingTiers}</div>}
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        backgroundColor: '#021529',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                      }}
                      block
                    >
                      Create Event
                    </Button>
                  </Form.Item>
                </Form>
                </Layout.Content>

                </Layout>
                <AppFooter/>
    </div>
  );
}

export default CreateEvent;