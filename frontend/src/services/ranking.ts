import { request } from 'umi';

/**
 * 获取选手排名
 * @param competitionId 比赛ID
 * @param stageId 可选的阶段ID
 */
export async function getPlayerRankings(competitionId: string, stageId?: string) {
  if (stageId) {
    return request(`/api/rankings/competition/${competitionId}/stage/${stageId}`, {
      method: 'GET',
    });
  }
  return request(`/api/rankings/competition/${competitionId}`, {
    method: 'GET',
  });
}

/**
 * 获取对战表
 * @param competitionId 比赛ID
 * @param stageId 阶段ID
 */
export async function getMatchups(competitionId: string, stageId: string) {
  return request(`/api/rankings/matchups/competition/${competitionId}/stage/${stageId}`, {
    method: 'GET',
  });
} 