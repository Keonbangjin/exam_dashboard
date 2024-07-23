import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, notification } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../redux/category/CategorySlice';
import { RootState, AppDispatch } from '../redux/store'; // Adjust the path as necessary

interface Category {
  _id: string;
  image: string;
  name: string;
}

const categorySchema = Joi.object({
  image: Joi.string().required().label('Image'),
  name: Joi.string().required().label('Name'),
});

const Categories: React.FC = () => {
  const categories = useSelector((state: RootState) => state.category.value);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Partial<Category> | null>(null);
  const [form] = Form.useForm<Category>();
  const [createForm] = Form.useForm<Category>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchCategory());
    }
  }, [navigate, dispatch]);

  const showModal = (category: Category) => {
    setSelectedCategory(category);
    form.setFieldsValue(category);
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setModalVisible(false);
  };

  const handleOk = async () => {
    if (!selectedCategory) return;
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.put(
        `https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${selectedCategory._id}`,
        values,
        { headers: { Authorization: token } }
      );
      dispatch(fetchCategory());
      notification.success({ message: 'Category edited successfully' });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const { error } = categorySchema.validate(values, { abortEarly: false });
      if (error) {
        error.details.forEach(detail => {
          createForm.setFields([{ name: detail.path[0] as string, errors: [detail.message] }]);
        });
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.post(
        'https://ecommerce-backend-fawn-eight.vercel.app/api/categories',
        values,
        { headers: { Authorization: token } }
      );
      dispatch(fetchCategory());
      notification.success({ message: 'Category created successfully' });
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.delete(
        `https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${id}`,
        { headers: { Authorization: token } }
      );
      dispatch(fetchCategory());
      notification.success({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image: string) => <img width={100} src={image} alt="category" />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Edit',
      dataIndex: 'editOperation',
      render: (_: any, record: Category) => (
        <Typography.Link onClick={() => showModal(record)}>
          Edit
        </Typography.Link>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'deleteOperation',
      render: (_: any, record: Category) => (
        <Typography.Link onClick={() => handleDelete(record._id)}>
          Delete
        </Typography.Link>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Button type="primary" onClick={() => setModalVisible(true)} className="mb-4">
        Create Category
      </Button>
      <Modal
        title="Create Category"
        visible={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={createForm}>
          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Category"
        visible={isEditModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={selectedCategory || {}}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={categories} rowKey="_id" />
    </div>
  );
};

export default Categories;
