import React from 'react';
import { Modal } from 'antd';
import '../ConfirmModal/ConfirmModal.css'
function ConfirmModal({
  visible,
  onConfirm,
  onCancel,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  centered = true
}) {
  return (
    <Modal
  title={title}
  open={visible}
  onOk={onConfirm}
  onCancel={onCancel}
  okText={confirmText}
  cancelText={cancelText}
  confirmLoading={loading}
  centered={centered}
  className="custom-confirm-modal" 
>
  {children}
</Modal>

  );
}

export default ConfirmModal;