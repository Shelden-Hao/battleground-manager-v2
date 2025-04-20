import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, List, Tag } from 'antd';
import { 
  TrophyOutlined, 
  UserOutlined, 
  ScheduleOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { getCompetitions } from '@/services/competition';
import { getMyRegistrations } from '@/services/registration';
import { getMyMatches } from '@/services/match';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [competitions, setCompetitions] = useState<API.Competition[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<API.Registration[]>([]);
  const [myMatches, setMyMatches] = useState<API.Match[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取比赛列表
      const competitionsRes = await getCompetitions();
      setCompetitions(competitionsRes || []);
      
      // 如果是选手，获取我的报名列表和比赛
      if (currentUser?.role === 'player') {
        const registrationsRes = await getMyRegistrations();
        setMyRegistrations(registrationsRes || []);
        
        const matchesRes = await getMyMatches();
        setMyMatches(matchesRes || []);
      }
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const renderWelcomeSection = () => (
    <div className={styles.welcomeSection}>
      <Title>欢迎使用霹雳舞比赛管理系统</Title>
      <Paragraph>
        本系统提供霹雳舞比赛的完整管理功能，包括参赛选手注册、比赛报名、分组对阵、裁判评分等。
      </Paragraph>
    </div>
  );
  
  const renderStatistics = () => (
    <Row gutter={16} className={styles.statisticsRow}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="当前进行中比赛"
            value={competitions.filter(c => c.status === 'in_progress').length}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="已注册选手"
            value={348}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总比赛场次"
            value={522}
            prefix={<ScheduleOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="已完成比赛"
            value={competitions.filter(c => c.status === 'completed').length}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );
  
  const renderCompetitionList = () => (
    <Card
      title="最近比赛"
      className={styles.listCard}
      extra={<Button type="link" onClick={() => history.push('/competitions')}>查看全部</Button>}
    >
      <List
        loading={loading}
        dataSource={competitions.slice(0, 5)}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                key="details"
                type="link"
                onClick={() => history.push(`/competitions/${item.id}`)}
              >
                查看详情
              </Button>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={`${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.end_date).toLocaleDateString()}`}
            />
            <div>
              <Tag color={
                item.status === 'draft' ? 'default' : 
                item.status === 'published' ? 'blue' : 
                item.status === 'in_progress' ? 'green' : 
                'red'
              }>
                {
                  item.status === 'draft' ? '草稿' : 
                  item.status === 'published' ? '已发布' : 
                  item.status === 'in_progress' ? '进行中' : 
                  '已结束'
                }
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
  
  const renderMyRegistrations = () => {
    if (currentUser?.role !== 'player') return null;
    
    return (
      <Card
        title="我的报名"
        className={styles.listCard}
        extra={<Button type="link" onClick={() => history.push('/registrations/my')}>查看全部</Button>}
      >
        <List
          loading={loading}
          dataSource={myRegistrations.slice(0, 5)}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Tag 
                  key="status"
                  color={
                    item.status === 'pending' ? 'orange' : 
                    item.status === 'approved' ? 'green' : 
                    'red'
                  }
                >
                  {
                    item.status === 'pending' ? '待审核' : 
                    item.status === 'approved' ? '已批准' : 
                    '已拒绝'
                  }
                </Tag>
              ]}
            >
              <List.Item.Meta
                title={item.competition?.title}
                description={`报名时间: ${new Date(item.created_at).toLocaleString()}`}
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  const renderMyMatches = () => {
    if (currentUser?.role !== 'player') return null;
    
    return (
      <Card
        title="我的比赛"
        className={styles.listCard}
        extra={<Button type="link" onClick={() => history.push('/my-matches')}>查看全部</Button>}
      >
        <List
          loading={loading}
          dataSource={myMatches.slice(0, 5)}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  key="details"
                  type="link"
                  onClick={() => history.push(`/matches/${item.id}`)}
                >
                  详情
                </Button>
              ]}
            >
              <List.Item.Meta
                title={`对阵: ${item.player1?.name} vs ${item.player2?.name}`}
                description={`比赛时间: ${item.scheduled_time ? new Date(item.scheduled_time).toLocaleString() : '待定'}`}
              />
              <div>
                <Tag color={
                  item.status === 'pending' ? 'default' : 
                  item.status === 'in_progress' ? 'processing' : 
                  'success'
                }>
                  {
                    item.status === 'pending' ? '未开始' : 
                    item.status === 'in_progress' ? '进行中' : 
                    '已完成'
                  }
                </Tag>
              </div>
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  // 添加选手排名和对战表快速链接
  const renderRankingAndMatchups = () => {
    // 只显示进行中或已完成的比赛
    const activeCompetitions = competitions.filter(
      c => c.status === 'in_progress' || c.status === 'completed'
    );
    
    if (activeCompetitions.length === 0) return null;
    
    return (
      <Card
        title="比赛数据"
        className={styles.listCard}
      >
        <List
          loading={loading}
          dataSource={activeCompetitions.slice(0, 3)}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  key="ranking"
                  type="link"
                  icon={<OrderedListOutlined />}
                  onClick={() => history.push(`/rankings/competition/${item.id}`)}
                >
                  查看排名
                </Button>,
                <Button
                  key="matchups"
                  type="link"
                  icon={<SwapOutlined />}
                  onClick={() => history.push(`/matchups/competition/${item.id}/stage/6`)}
                >
                  对战表
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={`${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.end_date).toLocaleDateString()}`}
              />
              <div>
                <Tag color={
                  item.status === 'in_progress' ? 'green' : 'red'
                }>
                  {item.status === 'in_progress' ? '进行中' : '已结束'}
                </Tag>
              </div>
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  return (
    <div className={styles.container}>
      {renderWelcomeSection()}
      {renderStatistics()}
      
      <Row gutter={16}>
        <Col xs={24} md={24} lg={12}>
          {renderCompetitionList()}
        </Col>
        <Col xs={24} md={24} lg={12}>
          {renderMyRegistrations()}
          {renderMyMatches()}
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          {renderRankingAndMatchups()}
        </Col>
      </Row>
    </div>
  );
};

export default Home;
