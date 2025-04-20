import { request } from '@umijs/max';

// 获取报名列表
export async function getRegistrations(params?: { competition_id?: number; status?: string; }) {
  return request('/api/registrations', {
    method: 'GET',
    params,
  });
}

// 获取我的报名列表
export async function getMyRegistrations() {
  return request('/api/registrations/my', {
    method: 'GET',
  });
}

// 创建报名
export async function register(params: {
  competition_id: number;
  player_id?: number;
}) {
  return request('/api/registrations', {
    method: 'POST',
    data: params,
  });
}

// 更新报名状态
export async function updateRegistration(id: number, params: {
  status: string;
}) {
  return request(`/api/registrations/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 取消报名
export async function cancelRegistration(id: number) {
  return request(`/api/registrations/${id}`, {
    method: 'DELETE',
  });
} 