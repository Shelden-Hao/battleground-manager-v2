import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Button, Table, Divider, Typography, Modal, Form, Input, InputNumber, message, Space, Empty, Spin } from 'antd';
import { useParams, useAccess } from '@umijs/max';
import { getMatch, updateMatch } from '@/services/match';
import { createScore } from '@/services/score';
import { TrophyOutlined, TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './Detail.less';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<API.Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<API.CurrentUser | null>(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const access = useAccess();
  const isJudge = access.isJudge;
  const isAdmin = access.isAdmin;
  
  const fetchMatch = async (matchId: number) => {
    setLoading(true);
    try {
      const res = await getMatch(matchId);
      setMatch(res);
    } catch (error) {
      console.error('获取比赛详情失败:', error);
      message.error('获取比赛详情失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchMatch(Number(id));
    }
  }, [id]);
  
  const handleScoreSubmit = async () => {
    if (!selectedPlayer || !match) return;
    
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      
      console.log('提交评分数据:', {
        match_id: match.id,
        player_id: selectedPlayer.id,
        score: values.score,
        comments: values.comments,
      });
      
      await createScore({
        match_id: match.id,
        player_id: selectedPlayer.id,
        score: values.score,
        comments: values.comments,
      });
      
      message.success('评分提交成功');
      setScoreModalVisible(false);
      fetchMatch(Number(id));
    } catch (error: any) {
      console.error('评分提交失败:', error);
      // 显示详细错误信息
      if (error.response && error.response.data) {
        message.error(`评分提交失败: ${error.response.data.message}`);
      } else {
        message.error('评分提交失败');
      }
    } finally {
      setConfirmLoading(false);
    }
  };
  
  const handleScoreModalOpen = (player: API.CurrentUser) => {
    setSelectedPlayer(player);
    form.resetFields();
    setScoreModalVisible(true);
  };
  
  const handleStatusChange = async (status: string) => {
    if (!match) return;
    
    try {
      await updateMatch(match.id, { status });
      message.success('状态更新成功');
      fetchMatch(Number(id));
    } catch (error) {
      console.error('状态更新失败:', error);
      message.error('状态更新失败');
    }
  };
  
  const renderMatchHeader = () => {
    if (!match) return null;
    
    return (
      <Card className={styles.matchHeader}>
        <Row align="middle" justify="space-between">
          <Col span={16}>
            <Title level={3}>
              {match.player1?.name || `选手${match.player1_id}`} VS {match.player2?.name || `选手${match.player2_id}`}
            </Title>
            <Space size="large">
              {match.scheduled_time && (
                <Text type="secondary">
                  <ClockCircleOutlined /> {moment(match.scheduled_time).format('YYYY-MM-DD HH:mm')}
                </Text>
              )}
              {match.group && (
                <Text type="secondary">
                  <TeamOutlined /> {match.group.name}
                </Text>
              )}
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Tag color={
              match.status === 'pending' ? 'default' : 
              match.status === 'in_progress' ? 'processing' : 
              'success'
            } style={{ fontSize: 16, padding: '4px 8px' }}>
              {
                match.status === 'pending' ? '未开始' : 
                match.status === 'in_progress' ? '进行中' : 
                '已完成'
              }
            </Tag>
            
            {isAdmin && (
              <div className={styles.adminActions}>
                {match.status === 'pending' && (
                  <Button 
                    type="primary" 
                    onClick={() => handleStatusChange('in_progress')}
                    style={{ marginTop: 8 }}
                  >
                    开始比赛
                  </Button>
                )}
                {match.status === 'in_progress' && (
                  <Button 
                    type="primary" 
                    onClick={() => handleStatusChange('completed')}
                    style={{ marginTop: 8 }}
                  >
                    完成比赛
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card>
    );
  };
  
  const renderScoreBoard = () => {
    if (!match) return null;
    
    return (
      <Card className={styles.scoreBoard} title="比分">
        <Row align="middle" justify="center" className={styles.scoreRow}>
          <Col span={10} className={styles.playerCol}>
            <Title level={4}>{match.player1?.name || `选手${match.player1_id}`}</Title>
          </Col>
          <Col span={4} className={styles.scoreCol}>
            <Title level={2}>
              {match.player1_score || 0} : {match.player2_score || 0}
            </Title>
          </Col>
          <Col span={10} className={styles.playerCol}>
            <Title level={4}>{match.player2?.name || `选手${match.player2_id}`}</Title>
          </Col>
        </Row>
        
        {match.winner && (
          <div className={styles.winner}>
            <TrophyOutlined style={{ color: '#faad14', fontSize: 20 }} /> 
            获胜者: {match.winner.name}
          </div>
        )}
      </Card>
    );
  };
  
  const renderScoreTables = () => {
    if (!match || !match.scores || match.scores.length === 0) {
      return (
        <Card className={styles.scoreTable} title="评分详情">
          <Empty description="暂无评分记录" />
        </Card>
      );
    }
    
    // 按选手分组
    const player1Scores = match.scores.filter(s => s.player_id === match.player1_id);
    const player2Scores = match.scores.filter(s => s.player_id === match.player2_id);
    
    const columns = [
      {
        title: '裁判',
        dataIndex: 'judge',
        key: 'judge',
        render: (judge?: API.CurrentUser) => judge?.name || '未知裁判',
      },
      {
        title: '分数',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '评语',
        dataIndex: 'comments',
        key: 'comments',
        render: (comments?: string) => comments || '-',
      },
    ];
    
    return (
      <Card className={styles.scoreTable} title="评分详情">
        <Divider orientation="left">
          {match.player1?.name || `选手${match.player1_id}`} 的评分
        </Divider>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={player1Scores}
          pagination={false}
        />
        
        <Divider orientation="left" style={{ marginTop: 24 }}>
          {match.player2?.name || `选手${match.player2_id}`} 的评分
        </Divider>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={player2Scores}
          pagination={false}
        />
      </Card>
    );
  };
  
  const renderJudgeActions = () => {
    if (!match || !isJudge || match.status !== 'in_progress') return null;
    
    return (
      <Card className={styles.judgeActions} title="裁判操作">
        <Row gutter={16}>
          <Col span={12}>
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={() => match.player1 && handleScoreModalOpen(match.player1)}
              disabled={!match.player1}
            >
              为 {match.player1?.name || `选手${match.player1_id}`} 评分
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={() => match.player2 && handleScoreModalOpen(match.player2)}
              disabled={!match.player2}
            >
              为 {match.player2?.name || `选手${match.player2_id}`} 评分
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };
  
  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        {renderMatchHeader()}
        
        <Row gutter={16} className={styles.contentRow}>
          <Col xs={24} md={12}>
            {renderScoreBoard()}
            {isJudge && renderJudgeActions()}
          </Col>
          <Col xs={24} md={12}>
            {renderScoreTables()}
          </Col>
        </Row>
        
        <Modal
          title={`为 ${selectedPlayer?.name || '选手'} 评分`}
          visible={scoreModalVisible}
          onCancel={() => setScoreModalVisible(false)}
          onOk={handleScoreSubmit}
          confirmLoading={confirmLoading}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="score"
              label="分数"
              rules={[
                { required: true, message: '请输入分数' },
                { type: 'number', min: 0, max: 100, message: '分数必须在0-100之间' }
              ]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="comments"
              label="评语"
            >
              <TextArea rows={4} placeholder="请输入评语" />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default MatchDetail; 