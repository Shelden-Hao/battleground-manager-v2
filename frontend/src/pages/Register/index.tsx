import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { register } from '@/services/auth';
import { Form, Input, Button, Card, message, Typography, Select } from 'antd';
import { history } from '@umijs/max';
import styles from './index.less';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    username: string;
    password: string;
    confirm: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
  }) => {
    try {
      setLoading(true);
      
      // 验证两次密码是否一致
      if (values.password !== values.confirm) {
        message.error('两次输入的密码不一致！');
        return;
      }
      
      // 调用注册接口
      const { confirm, ...registerData } = values;
      await register(registerData);
      
      message.success('注册成功！请登录');
      history.push('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={2}>注册新账号</Title>
          <Text type="secondary">加入霹雳舞比赛系统</Text>
        </div>
        
        <Form
          name="register"
          className={styles.form}
          onFinish={handleSubmit}
          initialValues={{
            role: 'player'
          }}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入姓名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="姓名"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择角色！' }]}
          >
            <Select
              placeholder="选择角色"
              size="large"
              suffixIcon={<UserSwitchOutlined />}
            >
              <Option value="player">选手</Option>
              <Option value="judge">裁判</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: '邮箱格式不正确！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱（选填）"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="phone"
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="手机号（选填）"
              size="large"
            />
          </Form.Item>
          
          <Form.Item className={styles.actions}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
          
          <div className={styles.footer}>
            <a onClick={() => history.push('/login')}>
              已有账号？返回登录
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 