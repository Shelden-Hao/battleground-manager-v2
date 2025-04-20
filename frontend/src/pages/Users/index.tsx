import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space, Typography, Row, Col, Tag, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/user';
import styles from './index.less';

const { Title } = Typography;
const { Option } = Select;
const { Password } = Input;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<API.CurrentUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<API.CurrentUser | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: { role?: string } = {};
      if (filterRole) {
        params.role = filterRole;
      }
      
      const res = await getUsers(params);
      setUsers(res || []);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const handleAdd = () => {
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: API.CurrentUser) => {
    setCurrentUser(record);
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      role: record.role,
      email: record.email || '',
      phone: record.phone || '',
    });
    setModalVisible(true);
  };

  const handleChangePassword = (record: API.CurrentUser) => {
    setCurrentUser(record);
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteUser(id);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      if (currentUser) {
        // 更新用户
        const { username, password, ...updateData } = values;
        await updateUser(currentUser.id, updateData);
        message.success('更新用户成功');
      } else {
        // 创建用户
        await createUser(values);
        message.success('创建用户成功');
      }
      
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请检查表单');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!currentUser) return;
    
    try {
      const values = await passwordForm.validateFields();
      setConfirmLoading(true);
      
      await updateUser(currentUser.id, { password: values.newPassword });
      message.success('密码修改成功');
      setPasswordModalVisible(false);
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRoleFilterChange = (value: string) => {
    setFilterRole(value === 'all' ? undefined : value);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = '';
        let text = '';
        
        switch (role) {
          case 'admin':
            color = 'red';
            text = '管理员';
            break;
          case 'player':
            color = 'green';
            text = '选手';
            break;
          case 'judge':
            color = 'blue';
            text = '裁判';
            break;
          default:
            color = 'default';
            text = '未知';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email?: string) => email || '-',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => phone || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.CurrentUser) => (
        <Space>
          <Tooltip title="编辑用户">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="修改密码">
            <Button 
              type="link" 
              icon={<LockOutlined />} 
              onClick={() => handleChangePassword(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除此用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除用户">
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2}>用户管理</Title>
        </Col>
        <Col>
          <Space>
            <Select
              placeholder="选择角色筛选"
              style={{ width: 150 }}
              onChange={handleRoleFilterChange}
              defaultValue="all"
            >
              <Option value="all">全部角色</Option>
              <Option value="admin">管理员</Option>
              <Option value="player">选手</Option>
              <Option value="judge">裁判</Option>
            </Select>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              创建用户
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Card>
        <Table 
          rowKey="id"
          loading={loading}
          dataSource={users}
          columns={columns}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 用户表单模态框 */}
      <Modal
        title={currentUser ? '编辑用户' : '创建用户'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
        maskClosable={false}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              disabled={!!currentUser}
            />
          </Form.Item>
          
          {!currentUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
          )}
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入姓名"
            />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="player">选手</Option>
              <Option value="judge">裁判</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
            />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="电话"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入电话"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        visible={passwordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => setPasswordModalVisible(false)}
        confirmLoading={confirmLoading}
        maskClosable={false}
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Password
              prefix={<LockOutlined />}
              placeholder="请确认新密码"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage; 