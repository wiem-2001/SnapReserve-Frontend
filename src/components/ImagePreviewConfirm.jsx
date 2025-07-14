import React from 'react';
import { Button, Space } from 'antd';

function ImagePreviewConfirm({ previewUrl, onConfirm, onCancel, confirmText = 'Confirm Image' }) {
  if (!previewUrl) return null;

  return (
    <div style={{ textAlign: 'center', marginBottom: 16 }}>
      <img
        src={previewUrl}
        alt="Preview"
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #ffd72d',
          marginBottom: 12
        }}
      />
      <div>
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: '#ffd72d', color: '#021529', fontWeight: 'bold' }}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            style={{ backgroundColor: '#021529', color: 'white', fontWeight: 'bold' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default ImagePreviewConfirm;
