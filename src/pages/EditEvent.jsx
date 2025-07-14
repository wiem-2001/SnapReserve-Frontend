import React, { useEffect, useState } from 'react';
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
  Spin
} from 'antd';
import { toast } from 'react-toastify';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../pages/Profile/Profile.css'
import { Layout } from 'antd';
import useEventStore from '../stores/eventStore'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../AppLayout/Header/Header';
import SidebarMenu from '../AppLayout/SidebarMenu/SidebarMenu';
import AppFooter from '../AppLayout/Footer';

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

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, fetchEvent, updateEvent } = useEventStore();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null,
    dates: [{ date: '', location: '' }],
    pricingTiers: [{ name: '', price: '',capacity : '' }]
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadEventData = async () => {
      try {
        await fetchEvent(id);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load event data');
        navigate('/getall-events');
      }
    };
    loadEventData();
  }, [id]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        category: event.category,
        description: event.description,
        image: event.image ? { 
          uid: '-1', 
          name: event.image.split('/').pop(), 
          status: 'done',
          url: `${import.meta.env.VITE_API_URL}${event.image}`
        } : null,
        dates: event.dates || [{ date: '', location: '' }],
        pricingTiers: event.pricingTiers || [{ name: '', price: '',capacity : '' }]
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (index, key, value) => {
    const newDates = [...formData.dates];
    newDates[index][key] = value;
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const handlePricingChange = (index, key, value) => {
    const newPricing = [...formData.pricingTiers];
    newPricing[index][key] = value;
    setFormData(prev => ({ ...prev, pricingTiers: newPricing }));
  };

  const addDateLocation = () => {
    setFormData(prev => ({ ...prev, dates: [...prev.dates, { date: '', location: '' }] }));
  };
  const removeDateLocation = (index) => {
    const newDates = formData.dates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, dates: newDates }));
  };

  const addPricingTier = () => {
    setFormData(prev => ({ ...prev, pricingTiers: [...prev.pricingTiers, { name: '', price: '',capacity: '' }] }));
  };
  const removePricingTier = (index) => {
    const newPricing = formData.pricingTiers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, pricingTiers: newPricing }));
  };

  const handleImageChange = (info) => {
    const fileList = info.fileList;

    if (fileList.length === 0) {
      setFormData(prev => ({ ...prev, image: null }));
    } else {
      const latestFile = fileList[fileList.length - 1];
      setFormData(prev => ({ ...prev, image: latestFile.originFileObj || null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';


    if (!formData.dates.length) {
      newErrors.dates = 'At least one date/location required';
    } else {
      formData.dates.forEach(({ date, location }, i) => {
        if (!date) newErrors.dates = `Date is required at row ${i + 1}`;
        if (!location.trim()) newErrors.dates = `Location is required at row ${i + 1}`;
      });
    }
    if (!formData.pricingTiers.length) {
      newErrors.pricingTiers = 'At least one pricing tier required';
    } else {
      formData.pricingTiers.forEach(({ name, price }, i) => {
        if (!name.trim()) newErrors.pricingTiers = `pricing tier name is required at row ${i + 1}`;
        if (price === '' || price < 0) newErrors.pricingTiers = `Price must be >= 0 at row ${i + 1}`;
         if (!capacity || capacity <= 0) newErrors.pricingTiers = `Capacity must be > 0 at row ${i + 1}`;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) {
    toast.error('Please fix errors before submitting');
    return;
  }

  try {
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('category', formData.category);
    submissionData.append('description', formData.description);
    submissionData.append('image', formData.image);
    submissionData.append('dates', JSON.stringify(formData.dates));
    submissionData.append('pricingTiers', JSON.stringify(formData.pricingTiers));

  
    for (let pair of submissionData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    await updateEvent(id, submissionData);
    toast.success('Event updated successfully!');
    navigate('/manage-events');

    toast.success('Event created successfully!');
    
  } catch (err) {
    toast.error(err.toString());
  }
};
 
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '50px',
              marginBottom: '10px'
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Edit Event</h2>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item label="Event Title" validateStatus={errors.title ? 'error' : ''} help={errors.title} className="custom-input">
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
              />
            </Form.Item>

            <Form.Item label="Category" validateStatus={errors.category ? 'error' : ''} help={errors.category} className="custom-input">
              <Select
                name="category"
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                placeholder="Select Category"
              >
                {defaultCategories.map(cat => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description} className="custom-input">
              <TextArea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
              />
            </Form.Item>

            <Form.Item label="Image" validateStatus={errors.image ? 'error' : ''} help={errors.image} className="custom-input">
              <Upload
                name="image"
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={true}
                maxCount={1}
                onChange={handleImageChange}
                fileList={formData.image ? [formData.image] : []}
                onRemove={() => setFormData(prev => ({ ...prev, image: null }))}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              <small>Leave empty to keep current image</small>
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
                {formData.dates.length > 1 && <MinusCircleOutlined onClick={() => removeDateLocation(i)} />}
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={addDateLocation} icon={<PlusOutlined />} style={{ width: '100%' }}>
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
                  value={priceObj.name}
                  onChange={e => handlePricingChange(i, 'name', e.target.value)}
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
                <Input
                  type="number"
                  placeholder="Capacity"
                  value={priceObj.capacity}
                  onChange={e => handlePricingChange(i, 'capacity', e.target.value)}
                  className="custom-input"
                  min={1}
                />
                {formData.pricingTiers.length > 1 && <MinusCircleOutlined onClick={() => removePricingTier(i)} />}
              </Space>
            ))}


            <Form.Item>
              <Button type="dashed" onClick={addPricingTier} icon={<PlusOutlined />} style={{ width: '100%' }}>
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
                  color: '#ffd72d',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  width:'200px',
                  margin:'15px 0px 0px 0px'
                }}
                block
              >
                Update Event
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

export default EditEvent;