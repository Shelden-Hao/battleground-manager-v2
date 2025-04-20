import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Spin, message, Typography, Tag, Space, Button } from 'antd';
import { useParams } from 'umi';
import { getMatchups } from '@/services/ranking';
import moment from 'moment';

const { Title } = Typography;

const MatchupsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [matchups, setMatchups] = useState<any>([]);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [stageInfo, setStageInfo] = useState<any>({});
  const { competitionId, stageId } = useParams<{ competitionId: string; stageId: string }>();

  const fetchMatchups = async () => {
    try {
      setLoading(true);
      const response = await getMatchups(competitionId, stageId);
      
      console.log('对战数据:', response); // 调试信息
      
      setMatchups(response.matches || []);
      setCompetitionInfo(response.competition || {});
      setStageInfo(response.stage || {});
    } catch (error) {
      message.error('获取对战表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (competitionId && stageId) {
      fetchMatchups();
    }
  }, [competitionId, stageId]);

  // 状态标签颜色映射
  const statusColors = {
    pending: 'default',
    ongoing: 'processing',
    completed: 'success',
    cancelled: 'error',
  };

  const columns = [
    {
      title: '比赛时间',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status === 'pending' ? '待开始' : 
           status === 'ongoing' ? '进行中' : 
           status === 'completed' ? '已完成' : 
           status === 'cancelled' ? '已取消' : status}
        </Tag>
      ),
    },
    {
      title: '选手1',
      key: 'player1',
      render: (record) => (
        <Space direction="vertical" size="small">
          <span>{record.player1?.name || `选手ID: ${record.player1?.id || '未知'}`}</span>
          {record.player1?.qualification_score !== null && (
            <small>资格赛得分: {record.player1.qualification_score}</small>
          )}
        </Space>
      ),
    },
    {
      title: '选手2',
      key: 'player2',
      render: (record) => (
        <Space direction="vertical" size="small">
          <span>{record.player2?.name || `选手ID: ${record.player2?.id || '未知'}`}</span>
          {record.player2?.qualification_score !== null && (
            <small>资格赛得分: {record.player2.qualification_score}</small>
          )}
        </Space>
      ),
    },
    {
      title: '比分',
      key: 'score',
      render: (record) => {
        if (record.status === 'completed') {
          return `${record.player1.score} : ${record.player2.score}`;
        }
        return '-';
      },
    },
    {
      title: '获胜方',
      key: 'winner',
      render: (record) => {
        if (record.status !== 'completed') return '-';
        
        if (record.winner_id === record.player1?.id) {
          return record.player1.name;
        } else if (record.winner_id === record.player2?.id) {
          return record.player2.name;
        }
        
        return '-';
      },
    },
  ];

  const refreshData = () => {
    fetchMatchups();
  };

  return (
    <PageContainer
      header={{
        title: '对战表',
        subTitle: competitionInfo.title,
      }}
    >
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>
            {stageInfo.name || '16强赛'} 对战表
          </Title>
          <Button type="primary" onClick={refreshData}>刷新数据</Button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : matchups.length > 0 ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={matchups}
            pagination={false}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>暂无对战数据</p>
            <p>请确认比赛ID: {competitionId}，阶段ID: {stageId}</p>
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default MatchupsPage; 