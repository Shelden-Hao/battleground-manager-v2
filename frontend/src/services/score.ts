import { request } from '@umijs/max';

// 获取评分列表
export async function getScores(params?: { match_id?: number; player_id?: number; judge_id?: number }) {
  return request('/api/scores', {
    method: 'GET',
    params,
  });
}

// 获取比赛的所有评分
export async function getMatchScores(matchId: number) {
  return request(`/api/scores/match/${matchId}`, {
    method: 'GET',
  });
}

// 获取选手的所有评分
export async function getPlayerScores(playerId: number) {
  return request(`/api/scores/player/${playerId}`, {
    method: 'GET',
  });
}

// 获取裁判的评分历史
export async function getJudgeScores(judgeId: number) {
  return request(`/api/scores/judge/${judgeId}`, {
    method: 'GET',
  });
}

// 获取我的评分（选手查看自己的评分，裁判查看自己评的分）
export async function getMyScores() {
  return request('/api/scores/my', {
    method: 'GET',
  });
}

// 创建评分
export async function createScore(params: {
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

// 更新评分
export async function updateScore(id: number, params: {
  score: number;
  comments?: string;
}) {
  return request(`/api/scores/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除评分
export async function deleteScore(id: number) {
  return request(`/api/scores/${id}`, {
    method: 'DELETE',
  });
} 