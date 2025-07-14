import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Typography,
  Divider,
  Upload,
  message
} from 'antd';
import { DeleteFilled, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../Profile/Profile.css';
import Header from '../../AppLayout/Header/Header';
import SidebarMenu from '../../AppLayout/SidebarMenu/SidebarMenu';
import AppFooter from '../../AppLayout/Footer';
import { Layout } from 'antd';
import useEventStore from '../../stores/eventStore';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;
const { Option } = Select;

const defaultCategories = [
  'Festival',
  'Concert',
  'Movie',
  'Conference',
  'Workshop',
  'Theater',
  'Exhibition',
  'Webinar',
  'Meetup',
  'Sport',
];

function CreateEvent() {
  const { createEvent } = useEventStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null,
    dates: [{ date: '', location: '' }],
    pricingTiers: [{ name: '', price: '', capacity: '' }]

  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        newErrors.title = value.trim() ? '' : 'Title is required';
        break;
      case 'category':
        newErrors.category = value ? '' : 'Category is required';
        break;
      case 'description':
        newErrors.description = value.trim() ? '' : 'Description is required';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDateChange = (index, key, value) => {
    const newDates = [...formData.dates];
    newDates[index][key] = value;
    setFormData(prev => ({ ...prev, dates: newDates }));
    
    const newErrors = { ...errors };
    const hasInvalidDates = newDates.some(d => !d.date || !d.location.trim());
    newErrors.dates = hasInvalidDates ? 'All dates and locations must be filled' : '';
    setErrors(newErrors);
  };

  const handlePricingChange = (index, key, value) => {
  const newPricing = [...formData.pricingTiers];
  newPricing[index][key] = value;
  setFormData(prev => ({ ...prev, pricingTiers: newPricing }));

  const newErrors = { ...errors };
  const hasInvalidPricing = newPricing.some(p => 
    !p.name.trim() || 
    p.price === '' || p.price < 0 || 
    !p.capacity || p.capacity <= 0
  );
  newErrors.pricingTiers = hasInvalidPricing ? 'All pricing tiers must be valid and have positive capacity' : '';
  setErrors(newErrors);
};
   

  const addDateLocation = () => {
    setFormData(prev => ({ ...prev, dates: [...prev.dates, { date: '', location: '' }] }));
  };

  const removeDateLocation = (index) => {
    const newDates = formData.dates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dates: newDates }));
    
    const newErrors = { ...errors };
    newErrors.dates = newDates.length === 0 ? 'At least one date/location required' : 
                     newDates.some(d => !d.date || !d.location.trim()) ? 'All dates and locations must be filled' : '';
    setErrors(newErrors);
  };

  const addPricingTier = () => {
    setFormData(prev => ({ ...prev, pricingTiers: [...prev.pricingTiers, { name: '', price: '' }] }));
  };

  const removePricingTier = (index) => {
    const newPricing = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, pricingTiers: newPricing }));
    
    const newErrors = { ...errors };
    newErrors.pricingTiers = newPricing.length === 0 ? 'At least one pricing tier required' : 
                            newPricing.some(p => !p.name.trim() || p.price === '' || p.price < 0) ? 'All pricing tiers must be valid' : '';
    setErrors(newErrors);
  };

  const handleImageChange = (info) => {
    const fileList = info.fileList;
    const newErrors = { ...errors };

    if (fileList.length === 0) {
      setFormData(prev => ({ ...prev, image: null }));
      newErrors.image = 'Image is required';
    } else {
      const latestFile = fileList[fileList.length - 1];
      setFormData(prev => ({ ...prev, image: latestFile.originFileObj || null }));
      newErrors.image = '';
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';

    if (!formData.dates.length) {
      newErrors.dates = 'At least one date/location required';
    } else if (formData.dates.some(d => !d.date || !d.location.trim())) {
      newErrors.dates = 'All dates and locations must be filled';
    }

    if (!formData.pricingTiers.length) {
      newErrors.pricingTiers = 'At least one pricing tier required';
    } else if (formData.pricingTiers.some(p => !p.name.trim() || p.price === '' || p.price < 0)) {
      newErrors.pricingTiers = 'All pricing tiers must be valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).filter(k => newErrors[k]).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('category', formData.category);
      submissionData.append('description', formData.description);
      submissionData.append('image', formData.image);
      submissionData.append('dates', JSON.stringify(formData.dates));
      submissionData.append('pricingTiers', JSON.stringify(formData.pricingTiers));
      navigate('/manage-events')
      await createEvent(submissionData);
      message.success('Event created successfully!');
      setFormData({
        title: '',
        category: '',
        description: '',
        image: null,
        dates: [{ date: '', location: '' }],
        pricingTiers: [{ name: '', price: '' }]
      });
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <Layout style={{ minHeight: '100vh', background: 'white' }}>
        <SidebarMenu />
        <Layout.Content style={{ padding: '0px 24px', background: '#fff' }}>
          <div
              style={{
                maxWidth: '700px',
                margin: '50px auto',
                padding: '0px',
                
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '50px',
                marginBottom: '10px'
              }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Create an event</h2>
          </div>
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
              hasFeedback
              className="custom-input"
            >
              <Select
                name="category"
                value={formData.category}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }));
                  validateField('category', value);
                }}
                placeholder="Select Category"
              >
                {defaultCategories.map(cat => (
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
              label="Image" 
              validateStatus={errors.image ? 'error' : ''} 
              help={errors.image}
              hasFeedback
              className="custom-input"
            >
              <Upload
                name="image"
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={true}
                maxCount={1}
                onChange={handleImageChange}
                fileList={formData.image ? [{ 
                  uid: '-1', 
                  name: formData.image.name, 
                  status: 'done', 
                  originFileObj: formData.image 
                }] : []}
                onRemove={() => {
                  setFormData(prev => ({ ...prev, image: null }));
                  setErrors(prev => ({ ...prev, image: 'Image is required' }));
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Divider />
            <Typography.Title level={5}>Dates & Locations</Typography.Title>
            {errors.dates && (
              <div className="error-message" style={{ color: '#ff4d4f', marginBottom: 10 }}>
                {errors.dates}
              </div>
            )}

            {formData.dates.map((dateObj, i) => (
              <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <DatePicker
                  value={dateObj.date ? moment(dateObj.date) : null}
                  onChange={date => handleDateChange(i, 'date', date?.format('YYYY-MM-DD'))}
                  className="custom-datepicker"
                  status={errors.dates ? 'error' : ''}
                />
                <Input
                  placeholder="Location"
                  value={dateObj.location}
                  onChange={e => handleDateChange(i, 'location', e.target.value)}
                  className="custom-input"
                  status={errors.dates ? 'error' : ''}
                />
                {formData.dates.length > 1 && (
                  <MinusCircleOutlined 
                    onClick={() => removeDateLocation(i)} 
                    style={{ color: '#ff4d4f' }} 
                  />
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
            </Form.Item>

            <Divider />
            <Typography.Title level={5}>Ticket Categories & Prices </Typography.Title>
            {errors.pricingTiers && (
              <div className="error-message" style={{ color: '#ff4d4f', marginBottom: 10 }}>
                {errors.pricingTiers}
              </div>
            )}

          {formData.pricingTiers.map((priceObj, i) => (
            <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
              <Input
                placeholder="Name (e.g. Adult)"
                value={priceObj.name}
                onChange={e => handlePricingChange(i, 'name', e.target.value)}
                className="custom-input"
                status={errors.pricingTiers ? 'error' : ''}
              />
              <Input
                type="number"
                placeholder="Price ($)"
                value={priceObj.price}
                onChange={e => handlePricingChange(i, 'price', e.target.value)}
                className="custom-input"
                min={0}
                status={errors.pricingTiers ? 'error' : ''}
              />
              <Input
                type="number"
                placeholder="Capacity"
                value={priceObj.capacity}
                onChange={e => handlePricingChange(i, 'capacity', e.target.value)}
                className="custom-input"
                min={1}
                status={errors.pricingTiers ? 'error' : ''}
              />
              {formData.pricingTiers.length > 1 && (
                <MinusCircleOutlined 
                  onClick={() => removePricingTier(i)} 
                  style={{ color: '#ff4d4f' }} 
                />
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
            </Form.Item>

            <Form.Item>
              
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: '#021529',
                  color: '#ffd72d',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  width:'200px',
                  margin:'15px 0px 0px 0px'
                }}
                block
                loading={isSubmitting}
              >
                Create Event
              </Button>
              
              
            </Form.Item>
          </Form>
          </div>
        </Layout.Content>
      </Layout>
      <AppFooter />
    </div>
  );
}

export default CreateEvent;