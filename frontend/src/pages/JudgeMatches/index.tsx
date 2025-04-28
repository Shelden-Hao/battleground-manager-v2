import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Typography, Space, Button, Empty, message, Spin } from 'antd';
import { history } from '@umijs/max';
import { getMatchesToJudge } from '@/services/match';
import { CalendarOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const { Title, Text } = Typography;

const JudgeMatches: React.FC = () => {
  const [matches, setMatches] = useState<API.Match[]>([]);
  const [loading, setLoading] = useState(false);

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

  // 格式化比赛时间
  const formatMatchTime = (time: string) => {
    if (!time) return '待定';
    return moment(time).format('YYYY-MM-DD HH:mm');
  };

  // 从API获取待评分的比赛
  const fetchJudgeMatches = async () => {
    setLoading(true);
    try {
      const res = await getMatchesToJudge();
      setMatches(res || []);
    } catch (error) {
      console.error('获取待评分比赛失败:', error);
      message.error('获取待评分比赛失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudgeMatches();
  }, []);

  // 表格列定义
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
      title: '选手',
      key: 'players',
      render: (_: any, record: API.Match) => (
        <Space direction="vertical">
          <Text strong>{record.player1?.name || `选手${record.player1_id}`}</Text>
          <Text type="secondary">VS</Text>
          <Text strong>{record.player2?.name || `选手${record.player2_id}`}</Text>
        </Space>
      ),
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      render: (group: { name: string }) => (
        group ? (
          <Space>
            <TeamOutlined />
            {group.name}
          </Space>
        ) : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.Match) => (
        <Button 
          type="primary" 
          onClick={() => history.push(`/matches/${record.id}`)}
        >
          前往评分
        </Button>
      ),
    },
  ];

  // 空状态展示
  const renderEmptyContent = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="暂无待评分比赛"
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space style={{ marginBottom: 16 }}>
          <Title level={2}>待评分比赛</Title>
          <Button type="primary" onClick={fetchJudgeMatches}>刷新</Button>
          <Button
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => history.push('/judge-scoring')}
          >
            批量评分
          </Button>
        </Space>
        <Text type="secondary">
          在此页面可以查看所有进行中需要评分的比赛，点击&quot;前往评分&quot;可进入比赛详情页进行评分。若要进行批量评分，可点击&quot;批量评分&quot;按钮。
        </Text>
      </div>

      <Spin spinning={loading}>
        {matches.length === 0 ? (
          renderEmptyContent()
        ) : (
          <Card className={styles.matchCard}>
            <Table 
              rowKey="id"
              dataSource={matches}
              columns={columns}
              pagination={false}
            />
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default JudgeMatches; 