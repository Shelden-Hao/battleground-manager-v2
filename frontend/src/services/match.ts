import { request } from '@umijs/max';

// 获取比赛对阵列表
export async function getMatches(params?: { 
  competition_id?: number; 
  stage_id?: number; 
  group_id?: number;
  status?: string;
}) {
  return request('/api/matches', {
    method: 'GET',
    params,
  });
}

// 获取单个比赛对阵详情
export async function getMatch(id: number) {
  return request(`/api/matches/${id}`, {
    method: 'GET',
  });
}

// 获取我的比赛
export async function getMyMatches() {
  return request('/api/matches/my', {
    method: 'GET',
  });
}

// 获取待评分的比赛（裁判）
export async function getMatchesToJudge() {
  return request('/api/matches/to-judge', {
    method: 'GET',
  });
}

// 创建比赛对阵
export async function createMatch(params: {
  competition_id: number;
  stage_id: number;
  group_id?: number;
  player1_id: number;
  player2_id: number;
  scheduled_time?: string;
}) {
  return request('/api/matches', {
    method: 'POST',
    data: params,
  });
}

// 更新比赛对阵
export async function updateMatch(id: number, params: {
  scheduled_time?: string;
  status?: string;
  player1_score?: number;
  player2_score?: number;
}) {
  return request(`/api/matches/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除比赛对阵
export async function deleteMatch(id: number) {
  return request(`/api/matches/${id}`, {
    method: 'DELETE',
  });
}

// 给比赛评分
export async function scoreMatch(params: {
  match_id: number;
  player_id: number;
  score: number;
  comments?: string;
}) {
  return request('/api/scores', {
    method: 'POST',
    data: params,
  });
} 