import { request } from '@umijs/max';

// 获取小组详情
export async function getGroup(id: number) {
  return request(`/api/groups/${id}`, {
    method: 'GET',
  });
}

// 创建小组
export async function createGroup(params: {
  competition_id: number;
  stage_id: number;
  name: string;
}) {
  return request('/api/groups', {
    method: 'POST',
    data: params,
  });
}

// 添加选手到小组
export async function addPlayersToGroup(groupId: number, params: {
  player_ids: number[];
}) {
  return request(`/api/groups/${groupId}/players`, {
    method: 'POST',
    data: params,
  });
}

// 更新选手小组信息
export async function updateGroupPlayer(groupId: number, playerId: number, params: {
  rank?: number;
  points?: number;
}) {
  return request(`/api/groups/${groupId}/players/${playerId}`, {
    method: 'PUT',
    data: params,
  });
}

// 从小组移除选手
export async function removePlayerFromGroup(groupId: number, playerId: number) {
  return request(`/api/groups/${groupId}/players/${playerId}`, {
    method: 'DELETE',
  });
} 