import { request } from '@umijs/max';

// 获取用户列表
export async function getUsers(params?: { role?: string }) {
  return request('/api/users', {
    method: 'GET',
    params,
  });
}

// 获取单个用户信息
export async function getUser(id: number) {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
}

// 创建用户
export async function createUser(params: {
  username: string;
  password: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}) {
  return request('/api/users', {
    method: 'POST',
    data: params,
  });
}

// 更新用户信息
export async function updateUser(id: number, params: {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  password?: string;
}) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除用户
export async function deleteUser(id: number) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
} 