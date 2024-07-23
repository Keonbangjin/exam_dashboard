import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Spin, notification } from 'antd';
import axios from 'axios';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, editProduct } from '../redux/product/ProductSlice';
import { RootState, AppDispatch } from '../redux/store';

interface Product {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  rate: number;
  price: number;
  color: string;
  size: string;
}

const productSchema = Joi.object({
  title: Joi.string().required().label("Title"),
  subtitle: Joi.string().required().label("Subtitle"),
  image: Joi.string().required().label("Image"),
  description: Joi.string().required().label("Description"),
  rate: Joi.number().required().label("Rate"),
  price: Joi.number().required().label("Price"),
  color: Joi.string().required().label("Color"),
  size: Joi.string().required().label("Size")
});

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { value: products, isLoading } = useSelector((state: RootState) => state.product);
  const dispatch = useDispatch<AppDispatch>();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm<Product>();
  const [createForm] = Form.useForm<Product>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showModal = (product: Product) => {
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
  };

  const handleOk = async () => {
    if (!selectedProduct) return;
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      if (!token) return;
      await dispatch(editProduct({ _id: selectedProduct._id, data: values })).unwrap();
      dispatch(fetchProduct()); // Fetch the updated products after editing
      notification.success({ message: 'Product edited successfully' });
    } catch (error) {
      console.error(error);
    }
    setIsEditModalOpen(false);
  };

  const handleChange = (changedValues: Partial<Product>) => {
    setSelectedProduct((prevProduct) => prevProduct ? ({
      ...prevProduct,
      ...changedValues
    }) : null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchProduct());
    }
  }, [navigate, dispatch]);

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const { error, value } = productSchema.validate(values, { abortEarly: false });
      if (error) {
        error.details.forEach(detail => {
          createForm.setFields([{ name: detail.path[0] as string, errors: [detail.message] }]);
        });
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post<Product>('https://ecommerce-backend-fawn-eight.vercel.app/api/products', value, {
        headers: { Authorization: token }
      });
      
      dispatch(fetchProduct());
      notification.success({ message: 'Product created successfully' });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${id}`, {
        headers: { Authorization: token }
      });

      dispatch(fetchProduct());
      notification.success({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image: string) => <img width={100} src={image} alt="product" />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Subtitle',
      dataIndex: 'subtitle',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Color',
      dataIndex: 'color',
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Edit',
      dataIndex: 'editOperation',
      render: (_: any, record: Product) => (
        <Typography.Link onClick={() => showModal(record)}>
          Edit
        </Typography.Link>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'deleteOperation',
      render: (_: any, record: Product) => (
        <Typography.Link onClick={() => handleDelete(record._id)}>
          Delete
        </Typography.Link>
      ),
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
        Create Product
      </Button>
      <Modal
        title="Create Product"
        open={isCreateModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
      >
        <Form form={createForm}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle" rules={[{ required: true, message: 'Please input the subtitle!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please input the rate!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please input the color!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input the size!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={selectedProduct || {}} onValuesChange={handleChange}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle" rules={[{ required: true, message: 'Please input the subtitle!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please input the rate!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please input the color!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please input the size!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={isLoading}>
        <Table columns={columns} dataSource={products} rowKey="_id" />
      </Spin>
    </div>
  );
};

export default ProductsPage;
