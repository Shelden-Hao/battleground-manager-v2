import { request } from '@umijs/max';

// 用户登录
export async function login(params: {
  username: string;
  password: string;
}) {
  return request('/api/auth/login', {
    method: 'POST',
    data: params,
  });
}

// 用户注册
export async function register(params: {
  username: string;
  password: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}) {
  return request('/api/auth/register', {
    method: 'POST',
    data: params,
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request('/api/auth/me', {
    method: 'GET',
  });
}

// 退出登录
export async function logout() {
  return request('/api/auth/logout', {
    method: 'POST',
  });
} 