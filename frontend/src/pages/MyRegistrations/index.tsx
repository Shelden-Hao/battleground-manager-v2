import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal, Typography, Empty, Row, Col } from 'antd';
import { history, useAccess } from '@umijs/max';
import { getMyRegistrations, cancelRegistration } from '@/services/registration';
import { CalendarOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Title, Text } = Typography;

const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const access = useAccess();
  const isPlayer = access.isPlayer;

  useEffect(() => {
    if (!isPlayer) {
      message.error('您不是选手，无法查看报名信息');
      history.push('/');
      return;
    }

    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    setLoading(true);
    try {
      const res = await getMyRegistrations();
      setRegistrations(res || []);
    } catch (error) {
      console.error('获取报名记录失败', error);
      message.error('获取报名记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id: number) => {
    Modal.confirm({
      title: '取消报名',
      content: '确定要取消报名吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelRegistration(id);
          message.success('已取消报名');
          fetchMyRegistrations();
        } catch (error) {
          console.error('取消报名失败', error);
          message.error('取消报名失败，请稍后重试');
        }
      },
    });
  };

  const renderStatusTag = (status: string) => {
    let color = 'default';
    let text = '未知状态';
    
    switch (status) {
      case 'draft':
        color = 'blue';
        text = '草稿';
        break;
      case 'registration':
        color = 'green';
        text = '已报名';
        break;
      case 'in_progress':
        color = 'red';
        text = '进行中';
        break;
      case 'completed':
        color = 'purple';
        text = '已完成';
        break;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '比赛名称',
      dataIndex: 'competition',
      key: 'competition',
      render: (competition: any) => (
        <Space>
          <TrophyOutlined />
          <span>{competition?.title || '未知比赛'}</span>
        </Space>
      ),
    },
    {
      title: '比赛时间',
      key: 'competition_date',
      render: (record: any) => (
        <Space>
          <CalendarOutlined />
          <span>
            {record.competition?.start_date && record.competition?.end_date 
              ? `${new Date(record.competition.start_date).toLocaleDateString()} - ${new Date(record.competition.end_date).toLocaleDateString()}`
              : '时间未定'
            }
          </span>
        </Space>
      ),
    },
    {
      title: '报名时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            type="primary"
            onClick={() => history.push(`/competitions/${record.competition_id}`)}
          >
            查看比赛
          </Button>
          {record.status !== 'rejected' && (
            <Button 
              danger
              onClick={() => handleCancel(record.id)}
            >
              取消报名
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const renderEmpty = () => (
    <Empty
      description="您还没有报名任何比赛"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
      <Button 
        type="primary" 
        onClick={() => history.push('/competitions')}
      >
        去报名比赛
      </Button>
    </Empty>
  );

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2}>我的报名</Title>
        </Col>
        <Col>
          <Button 
            type="primary"
            onClick={() => history.push('/competitions')}
          >
            报名新比赛
          </Button>
        </Col>
      </Row>

      <Card className={styles.card}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={registrations}
          loading={loading}
          locale={{ emptyText: renderEmpty() }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default MyRegistrationsPage; 