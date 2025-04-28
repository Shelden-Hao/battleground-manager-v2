import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '@/services/auth';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { history, useModel } from '@umijs/max';
import styles from './index.less';
import { useState } from 'react';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
      return true;
    }
    return false;
  };

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      // 调用登录接口
      const res = await login(values);
      
      if (res.token) {
        // 存储 token
        localStorage.setItem('token', res.token);
        
        // 获取用户信息
        await fetchUserInfo();
        
        message.success('登录成功！');
        sessionStorage.removeItem('redirecting');
        
        // 直接跳转到首页，不再等待其他操作
        setTimeout(() => {
          history.push('/home');
        }, 100);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={2}>霹雳舞比赛管理系统</Title>
          <Text type="secondary">登录以使用系统功能</Text>
        </div>
        
        <Form
          name="login"
          className={styles.form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
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
              登录
            </Button>
          </Form.Item>
          
          <div className={styles.footer}>
            <a onClick={() => history.push('/register')}>
              还没有账号？立即注册
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 