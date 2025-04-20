import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Spin, message, Typography, Button } from 'antd';
import { useParams, history } from 'umi';
import { getPlayerRankings } from '@/services/ranking';

const { Title } = Typography;

const RankingsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rankings, setRankings] = useState<any>([]);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [stageInfo, setStageInfo] = useState<any>({});
  const { competitionId, stageId } = useParams<{ competitionId: string; stageId?: string }>();

  const fetchRankings = async () => {
    try {
      setLoading(true);
      let response;
      
      if (stageId) {
        response = await getPlayerRankings(competitionId, stageId);
      } else {
        response = await getPlayerRankings(competitionId);
      }
      
      console.log('排名数据:', response); // 调试信息
      
      setRankings(response.players || []);
      setCompetitionInfo(response.competition || {});
      setStageInfo(response.stage || {});
    } catch (error) {
      message.error('获取排名数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (competitionId) {
      fetchRankings();
    }
  }, [competitionId, stageId]);

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
    },
    {
      title: '选手名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      defaultSortOrder: 'descend',
    },
    {
      title: '评委',
      dataIndex: ['judge', 'name'],
      key: 'judge',
    },
    {
      title: '评价',
      dataIndex: 'comments',
      key: 'comments',
      ellipsis: true,
    },
  ];

  const viewMatchups = () => {
    // 如果没有提供stageInfo.id，使用下一个阶段的ID（假设为stageInfo.id + 1）
    // 否则，使用现有的stageInfo.id + 1
    const nextStageId = stageInfo?.id ? parseInt(stageInfo.id) + 1 : undefined;
    
    if (nextStageId) {
      history.push(`/matchups/competition/${competitionId}/stage/${nextStageId}`);
    } else {
      message.error('无法确定下一阶段ID');
    }
  };

  const refreshData = () => {
    fetchRankings();
  };

  return (
    <PageContainer
      header={{
        title: '选手排名',
        subTitle: competitionInfo.title,
      }}
    >
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>
            {stageInfo.name || '资格赛'} 选手排名
          </Title>
          <Button type="primary" onClick={refreshData}>刷新数据</Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : rankings.length > 0 ? (
          <>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={rankings}
              pagination={false}
            />
            
            {stageInfo.status === 'completed' && (
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" onClick={viewMatchups}>查看对战表</Button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>暂无排名数据</p>
            <p>请确认比赛ID: {competitionId}，阶段ID: {stageId || '默认第一阶段'}</p>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default RankingsPage; 