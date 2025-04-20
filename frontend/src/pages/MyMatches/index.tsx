import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Typography, Space, Tag, Button, Empty, message, Spin } from 'antd';
import { history, useModel } from '@umijs/max';
import { getMyMatches } from '@/services/match';
import { TrophyOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const { Title, Text } = Typography;

const MyMatchesPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [matches, setMatches] = useState<API.Match[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = initialState?.currentUser;

  // 获取比赛状态标签
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Badge status="warning" text="待开始" />;
      case 'IN_PROGRESS':
        return <Badge status="processing" text="进行中" />;
      case 'COMPLETED':
        return <Badge status="success" text="已结束" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };

  // 判断当前用户是否为选手1
  const isPlayer1 = (match: API.Match, user?: API.CurrentUser) => {
    if (!user) return false;
    return match.player1_id === user.id;
  };

  // 获取对手信息
  const getOpponent = (match: API.Match, user?: API.CurrentUser) => {
    if (!match.player1 || !match.player2 || !user) return '未分配';
    
    return isPlayer1(match, user) 
      ? match.player2.name 
      : match.player1.name;
  };

  // 获取比赛结果
  const getMatchResult = (match: API.Match, user?: API.CurrentUser) => {
    if (match.status?.toUpperCase() !== 'COMPLETED' || !user) {
      return '-';
    }

    const isP1 = isPlayer1(match, user);
    const myScore = isP1 ? match.player1_score : match.player2_score;
    const opponentScore = isP1 ? match.player2_score : match.player1_score;

    if (myScore > opponentScore) {
      return <Tag color="green">胜利</Tag>;
    } else if (myScore < opponentScore) {
      return <Tag color="red">失败</Tag>;
    } else {
      return <Tag color="blue">平局</Tag>;
    }
  };

  const formatMatchTime = (time: string) => {
    if (!time) return '待定';
    return moment(time).format('YYYY-MM-DD HH:mm');
  };

  const fetchMyMatches = async () => {
    setLoading(true);
    try {
      const res = await getMyMatches();
      setMatches(res || []);
    } catch (error) {
      console.error('获取我的比赛失败:', error);
      message.error('获取我的比赛失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMatches();
  }, []);

  const columns = [
    {
      title: '比赛时间',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time: string) => (
        <Space>
          <CalendarOutlined />
          {formatMatchTime(time)}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: '对手',
      key: 'opponent',
      render: (_: any, record: API.Match) => (
        <Text strong>{getOpponent(record, currentUser)}</Text>
      ),
    },
    {
      title: '结果',
      key: 'result',
      render: (_: any, record: API.Match) => getMatchResult(record, currentUser),
    },
    {
      title: '得分',
      key: 'score',
      render: (_: any, record: API.Match) => {
        const isP1 = isPlayer1(record, currentUser);
        const myScore = isP1 ? record.player1_score : record.player2_score;
        const opponentScore = isP1 ? record.player2_score : record.player1_score;
        
        if (record.status?.toUpperCase() === 'COMPLETED') {
          return (
            <Space>
              <Text type={myScore > opponentScore ? 'success' : myScore < opponentScore ? 'danger' : undefined} strong>
                {myScore || 0}
              </Text>
              <Text>:</Text>
              <Text>{opponentScore || 0}</Text>
            </Space>
          );
        }
        return '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.Match) => (
        <Button 
          type="link" 
          onClick={() => history.push(`/matches/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const renderEmptyContent = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无比赛记录"
    >
      <Button type="primary" onClick={() => history.push('/competitions')}>
        浏览比赛
      </Button>
    </Empty>
  );

  const groupMatchesByStatus = () => {
    const pendingMatches = matches.filter(m => m.status?.toUpperCase() === 'PENDING');
    const inProgressMatches = matches.filter(m => m.status?.toUpperCase() === 'IN_PROGRESS');
    const completedMatches = matches.filter(m => m.status?.toUpperCase() === 'COMPLETED');

    return { pendingMatches, inProgressMatches, completedMatches };
  };

  const { pendingMatches, inProgressMatches, completedMatches } = groupMatchesByStatus();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2}>我的比赛</Title>
      </div>

      <Spin spinning={loading}>
        {matches.length === 0 ? (
          renderEmptyContent()
        ) : (
          <>
            {inProgressMatches.length > 0 && (
              <Card 
                title={<Space><ClockCircleOutlined /> 进行中的比赛</Space>} 
                className={styles.matchCard}
              >
                <Table 
                  rowKey="id"
                  dataSource={inProgressMatches}
                  columns={columns}
                  pagination={false}
                />
              </Card>
            )}

            {pendingMatches.length > 0 && (
              <Card 
                title={<Space><CalendarOutlined /> 即将进行的比赛</Space>} 
                className={styles.matchCard}
              >
                <Table 
                  rowKey="id"
                  dataSource={pendingMatches}
                  columns={columns}
                  pagination={false}
                />
              </Card>
            )}

            {completedMatches.length > 0 && (
              <Card 
                title={<Space><TrophyOutlined /> 已完成的比赛</Space>} 
                className={styles.matchCard}
              >
                <Table 
                  rowKey="id"
                  dataSource={completedMatches}
                  columns={columns}
                  pagination={false}
                />
              </Card>
            )}
          </>
        )}
      </Spin>
    </div>
  );
};

export default MyMatchesPage; 