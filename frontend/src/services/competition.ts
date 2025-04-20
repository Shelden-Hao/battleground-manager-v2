import { request } from '@umijs/max';

// 获取比赛列表
export async function getCompetitions() {
  return request('/api/competitions', {
    method: 'GET',
  });
}

// 获取单个比赛信息
export async function getCompetition(id: number) {
  return request(`/api/competitions/${id}`, {
    method: 'GET',
  });
}

// 创建比赛
export async function createCompetition(params: {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}) {
  return request('/api/competitions', {
    method: 'POST',
    data: params,
  });
}

// 更新比赛信息
export async function updateCompetition(id: number, params: {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}) {
  return request(`/api/competitions/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除比赛
export async function deleteCompetition(id: number) {
  return request(`/api/competitions/${id}`, {
    method: 'DELETE',
  });
}

// 获取比赛阶段信息
export async function getCompetitionStage(id: number, stageId: number) {
  return request(`/api/competitions/${id}/stages/${stageId}`, {
    method: 'GET',
  });
}

// 生成32强对阵表
export async function generateTop32Matches(id: number) {
  return request(`/api/competitions/${id}/generate-32`, {
    method: 'POST',
  });
}

// 生成下一轮对阵表
export async function generateNextRoundMatches(id: number, stageId: number) {
  return request(`/api/competitions/${id}/generate-next`, {
    method: 'POST',
    data: { stageId },
  });
} 