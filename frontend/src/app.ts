// 运行时配置
import { history } from '@umijs/max';
import { message } from 'antd';
import { getCurrentUser } from './services/auth';

// 定义权限相关类型
export interface CurrentUser {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'player' | 'judge';
  email?: string;
  phone?: string;
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  currentUser?: CurrentUser;
  fetchUserInfo?: () => Promise<CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUser();
      return res;
    } catch (error) {
      // 避免直接跳转，只返回undefined
      console.error('Failed to fetch user info:', error);
      return undefined;
    }
  };

  // 如果不是登录页面，则获取用户信息
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/register') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
    };
  }
  
  return {
    fetchUserInfo,
  };
}

// 布局配置
export const layout = ({ initialState }: { initialState: { currentUser?: CurrentUser } }) => {
  return {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    menu: {
      locale: false,
    },
    avatarProps: initialState?.currentUser 
      ? { 
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          title: `${initialState.currentUser.name} (${
            initialState.currentUser.role === 'admin' 
              ? '管理员' 
              : initialState.currentUser.role === 'player' 
                ? '选手' 
                : '裁判'
          })`,
          size: 'small',
        }
      : undefined,
    // 水印
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    // 页面切换时触发
    onPageChange: () => {
      const currentPath = window.location.pathname;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        // 添加一个简单的标记，避免循环跳转
        if (!sessionStorage.getItem('redirecting')) {
          sessionStorage.setItem('redirecting', 'true');
          history.push('/login');
          setTimeout(() => {
            sessionStorage.removeItem('redirecting');
          }, 1000);
        }
      }
    },
  };
};

// 请求配置
export const request = {
  timeout: 10000,
  errorConfig: {
    // 错误处理
    errorHandler: (error: any) => {
      if (error.response) {
        if (error.response.status === 401) {
          // 未授权，跳转到登录页
          localStorage.removeItem('token'); // 清除无效token
          if (!sessionStorage.getItem('redirecting')) {
            sessionStorage.setItem('redirecting', 'true');
            history.push('/login');
            message.error('登录已过期，请重新登录');
            setTimeout(() => {
              sessionStorage.removeItem('redirecting');
            }, 1000);
          }
        } else if (error.response.status === 403) {
          // 没有权限
          message.error('没有权限访问该资源');
        } else {
          message.error(error.response.data?.message || '请求失败');
        }
      } else {
        message.error('网络连接异常，请稍后重试');
      }
      throw error;
    },
  },
  requestInterceptors: [
    // 请求拦截器，携带token
    (url: string, options: any) => {
      const token = localStorage.getItem('token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      return {
        url,
        options: { ...options, headers: { ...options.headers, ...authHeader } },
      };
    },
  ],
  responseInterceptors: [
    // 响应拦截器，处理token
    (response: Response) => {
      return response;
    },
  ],
};
