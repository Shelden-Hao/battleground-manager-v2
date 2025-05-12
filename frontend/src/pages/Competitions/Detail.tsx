import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Steps, Tabs, Table, Tag, message, Modal, Space, Typography, Row, Col, Statistic } from 'antd';
import { history, useAccess, useParams } from '@umijs/max';
import { 
  TrophyOutlined, 
  TeamOutlined, 
  UserSwitchOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { getCompetition, getCompetitionStage, generateTop32Matches, generateNextRoundMatches } from '@/services/competition';
import { getMatches } from '@/services/match';
import { register, cancelRegistration, getMyRegistrations } from '@/services/registration';
import styles from './Detail.less';

const { Step } = Steps;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const CompetitionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [competition, setCompetition] = useState<API.Competition | null>(null);
  const [stages, setStages] = useState<API.CompetitionStage[]>([]);
  const [matches, setMatches] = useState<API.Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const access = useAccess();
  const isAdmin = access.isAdmin;
  const isPlayer = access.isPlayer;
  
  useEffect(() => {
    if (id) {
      fetchCompetition(Number(id));
      checkRegistrationStatus();
    }
  }, [id]);
  
  useEffect(() => {
    if (id && activeStage) {
      fetchMatches(Number(id), activeStage);
    }
  }, [id, activeStage]);
  
  const fetchCompetition = async (competitionId: number) => {
    setLoading(true);
    try {
      const res = await getCompetition(competitionId);
      setCompetition(res);
      setStages(res.stages || []);
      
      // 默认选中第一个阶段
      if (res.stages && res.stages.length > 0) {
        setActiveStage(res.stages[0].id);
      }
    } catch (error) {
      console.error('获取比赛详情失败', error);
      message.error('获取比赛详情失败');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMatches = async (competitionId: number, stageId: number) => {
    setLoading(true);
    try {
      const res = await getMatches({ 
        competition_id: competitionId, 
        stage_id: stageId 
      });
      setMatches(res || []);
    } catch (error) {
      console.error('获取比赛场次失败', error);
      message.error('获取比赛场次失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateTop32 = async () => {
    Modal.confirm({
      title: '生成32强对阵表',
      content: '确定要生成32强对阵表吗？系统将自动按照报名选手分组并生成对阵。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await generateTop32Matches(Number(id));
          message.success('生成对阵表成功');
          fetchCompetition(Number(id));
        } catch (error) {
          console.error('生成对阵表失败', error);
          message.error('生成对阵表失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };
  
  const handleGenerateNextRound = async (stageId: number) => {
    Modal.confirm({
      title: '生成下一轮对阵表',
      content: '确定要生成下一轮对阵表吗？系统将根据当前阶段的结果自动生成下一轮的对阵。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await generateNextRoundMatches(Number(id), stageId);
          message.success('生成下一轮对阵表成功');
          fetchCompetition(Number(id));
        } catch (error) {
          console.error('生成下一轮对阵表失败', error);
          message.error('生成下一轮对阵表失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };
  
  const renderStageStatus = (status: string) => {
    if (status === 'pending') {
      return <Tag icon={<ClockCircleOutlined />} color="default">未开始</Tag>;
    } else if (status === 'in_progress') {
      return <Tag icon={<SyncOutlined spin />} color="processing">进行中</Tag>;
    } else if (status === 'completed') {
      return <Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>;
    }
    return null;
  };
  
  const renderActions = (stage: API.CompetitionStage) => {
    if (!isAdmin) return null;
    
    if (stage.order === 1 && stage.status === 'pending') {
      return (
        <Button type="primary" onClick={handleGenerateTop32}>
          生成32强对阵表
        </Button>
      );
    } else if (stage.status === 'completed' && stage.order < 3) {
      // 如果当前阶段已完成，且不是最后一个阶段，允许生成下一轮
      return (
        <Button type="primary" onClick={() => handleGenerateNextRound(stage.id)}>
          生成下一轮对阵表
        </Button>
      );
    }
    
    return null;
  };
  
  const renderStages = () => {
    return (
      <Steps 
        className={styles.steps} 
        direction="horizontal"
        current={stages.findIndex(s => s.status === 'in_progress')}
      >
        {stages.map((stage) => (
          <Step 
            key={stage.id} 
            title={stage.name} 
            description={renderStageStatus(stage.status)} 
          />
        ))}
      </Steps>
    );
  };
  
  const renderMatches = () => {
    const columns = [
      {
        title: '对阵',
        dataIndex: 'players',
        key: 'players',
        render: (_: any, record: API.Match) => (
          <Space>
            <span>{record.player1?.name || `选手${record.player1_id}`}</span>
            <span>VS</span>
            <span>{record.player2?.name || `选手${record.player2_id}`}</span>
          </Space>
        ),
      },
      {
        title: '比分',
        key: 'score',
        render: (record: API.Match) => (
          <span>
            {record.player1_score} : {record.player2_score}
          </span>
        ),
      },
      {
        title: '小组',
        dataIndex: 'group',
        key: 'group',
        render: (group: any) => group?.name || '-',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          if (status === 'pending') {
            return <Tag color="default">未开始</Tag>;
          } else if (status === 'in_progress') {
            return <Tag color="processing">进行中</Tag>;
          } else if (status === 'completed') {
            return <Tag color="success">已完成</Tag>;
          }
          return null;
        },
      },
      {
        title: '比赛时间',
        dataIndex: 'scheduled_time',
        key: 'scheduled_time',
        render: (time: string) => time ? new Date(time).toLocaleString() : '待定',
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: API.Match) => (
          <Button 
            type="link" 
            onClick={() => history.push(`/matches/${record.id}`)}
          >
            详情
          </Button>
        ),
      },
    ];
    
    return (
      <Table 
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={matches}
        pagination={{ pageSize: 10 }}
      />
    );
  };
  
  const handleTabChange = (key: string) => {
    setActiveStage(Number(key));
  };
  
  // 检查当前用户是否已报名本比赛
  const checkRegistrationStatus = async () => {
    if (!id || !isPlayer) return;
    
    try {
      const registrations = await getMyRegistrations();
      const currentRegistration = registrations.find(
        (reg: any) => reg.competition_id === Number(id)
      );
      
      if (currentRegistration) {
        setIsRegistered(true);
        setRegistrationId(currentRegistration.id);
      } else {
        setIsRegistered(false);
        setRegistrationId(null);
      }
    } catch (error) {
      console.error('获取报名状态失败', error);
    }
  };
  
  // 报名比赛
  const handleRegister = async () => {
    if (!id) return;
    
    setRegisterLoading(true);
    try {
      await register({ competition_id: Number(id) });
      message.success('报名成功');
      checkRegistrationStatus();
    } catch (error) {
      console.error('报名失败', error);
      message.error('报名失败，请稍后重试');
    } finally {
      setRegisterLoading(false);
    }
  };
  
  // 取消报名
  const handleCancelRegistration = () => {
    if (!registrationId) return;
    
    Modal.confirm({
      title: '取消报名',
      content: '确定要取消报名吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setRegisterLoading(true);
        try {
          await cancelRegistration(registrationId);
          message.success('已取消报名');
          setIsRegistered(false);
          setRegistrationId(null);
        } catch (error) {
          console.error('取消报名失败', error);
          message.error('取消报名失败，请稍后重试');
        } finally {
          setRegisterLoading(false);
        }
      },
    });
  };
  
  return (
    <div className={styles.container}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2}>{competition?.title}</Title>
              </Col>
              <Col>
                <Space>
                  {isPlayer && !isAdmin && (
                    isRegistered ? (
                      <Button 
                        type="default" 
                        danger
                        loading={registerLoading}
                        onClick={handleCancelRegistration}
                      >
                        取消报名
                      </Button>
                    ) : (
                      <Button 
                        type="primary" 
                        loading={registerLoading}
                        onClick={handleRegister}
                        disabled={competition?.status === 'completed' || competition?.status === 'in_progress'}
                      >
                        报名比赛
                      </Button>
                    )
                  )}
                  {isAdmin && (
                    <Button 
                      type="primary" 
                      onClick={() => history.push(`/registrations?competition_id=${id}`)}
                    >
                      查看报名选手
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      {competition && (
        <>
          <Card className={styles.header}>
            <Row>
              <Col span={16}>
                <Title level={2}>{competition.title}</Title>
                <Text>{competition.description}</Text>
                <br />
                <Text type="secondary">
                  比赛时间: {new Date(competition.start_date).toLocaleDateString()} 至 {new Date(competition.end_date).toLocaleDateString()}
                </Text>
              </Col>
              <Col span={8}>
                <div className={styles.statistics}>
                  <Statistic 
                    title="比赛状态" 
                    value={
                      competition.status === 'draft' ? '草稿' : 
                      competition.status === 'published' ? '已发布' : 
                      competition.status === 'in_progress' ? '进行中' : 
                      '已结束'
                    } 
                    prefix={<TrophyOutlined />} 
                  />
                </div>
              </Col>
            </Row>
          </Card>
          
          <Card className={styles.stagesCard} title="比赛阶段">
            {renderStages()}
          </Card>
          
          <Card className={styles.matchesCard}>
            <Tabs 
              activeKey={activeStage?.toString()} 
              onChange={handleTabChange}
              tabBarExtraContent={
                activeStage && 
                renderActions(stages.find(s => s.id === activeStage) as API.CompetitionStage)
              }
            >
              {stages.map(stage => (
                <TabPane tab={stage.name} key={stage.id.toString()}>
                  {renderMatches()}
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompetitionDetail; 