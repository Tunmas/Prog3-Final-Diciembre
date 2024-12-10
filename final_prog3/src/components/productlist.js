import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin, message, Button, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Columnas de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado ? 'green' : 'red'}>
          {estado ? 'Habilitado' : 'Agotado'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleQuantityChange(record.id, 'increase')}>↑</Button>
          <Button onClick={() => handleQuantityChange(record.id, 'decrease')} style={{ marginLeft: 8 }}> ↓ </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        setProducts(response.data);
      } catch (error) {
        message.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = async (id, action) => {
    try {
      const product = products.find((prod) => prod.id === id);
      const updatedQuantity = action === 'increase' ? product.cantidad + 1 : product.cantidad - 1;

      if (updatedQuantity < 0) {
        message.error('La cantidad no puede ser negativa');
        return;
      }

      const response = await axios.put(`http://localhost:5000/api/productos/${id}`, { cantidad: updatedQuantity });
      
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, cantidad: updatedQuantity, estado: response.data.estado } : prod
        )
      );

      message.success('Cantidad y estado actualizados correctamente');
    } catch (error) {
      message.error('Error al actualizar la cantidad');
      console.error(error.response || error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const { nombre, precio, cantidad } = values;

      const response = await axios.post('http://localhost:5000/api/productos', {
        nombre,
        precio,
        cantidad,
        estado: cantidad > 0,
      });

      setProducts([...products, response.data]);
      form.resetFields();
      setIsModalVisible(false);
      
      message.success('Producto agregado correctamente');
    } catch (error) {
      message.error('Error al agregar el producto');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}>
        <Spin tip="Cargando productos..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '5%' }}>
      <div style={{ padding: '20px' }}>
      <h1>Lista de Productos</h1>
    </div>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button type="primary" onClick={showModal}>
          Agregar Producto
        </Button>
      </div>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Agregar Producto"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nombre"
                label="Nombre del Producto"
                rules={[{ required: true, message: 'Por favor ingresa el nombre del producto' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="precio"
                label="Precio"
                rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
              >
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cantidad"
                label="Cantidad"
                rules={[{ required: true, message: 'Por favor ingresa la cantidad' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button type="primary" onClick={handleAdd} style={{ marginTop: '32px', width: '100%' }}>
                Agregar
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
