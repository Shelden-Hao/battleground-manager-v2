import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal, Typography, Row, Col, Select, Input, Form } from 'antd';
import { history, useAccess } from '@umijs/max';
import { getRegistrations, updateRegistration, cancelRegistration } from '@/services/registration';
import { getCompetitions } from '@/services/competition';
import { CheckOutlined, CloseOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const RegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [searchName, setSearchName] = useState('');

  // 获取URL参数中的比赛ID
  const urlParams = new URLSearchParams(window.location.search);
  const competitionIdFromUrl = urlParams.get('competition_id');

  const access = useAccess();
  const isAdmin = access.isAdmin;

  // 获取所有比赛
  const fetchCompetitions = async () => {
    try {
      const res = await getCompetitions();
      setCompetitions(res || []);
    } catch (error) {
      console.error('获取比赛列表失败', error);
      message.error('获取比赛列表失败');
    }
  };

  // 获取报名列表
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCompetition) {
        params.competition_id = selectedCompetition;
      }
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const res = await getRegistrations(params);
      
      // 如果有选手姓名搜索，进行客户端过滤
      let filteredData = res || [];
      if (searchName) {
        filteredData = filteredData.filter((item: any) => 
          item.player?.name?.toLowerCase().includes(searchName.toLowerCase()) ||
          item.player?.username?.toLowerCase().includes(searchName.toLowerCase())
        );
      }
      
      setRegistrations(filteredData);
    } catch (error) {
      console.error('获取报名列表失败', error);
      message.error('获取报名列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      message.error('您没有权限访问此页面');
      history.push('/');
      return;
    }

    // 获取所有比赛
    fetchCompetitions();

    // 如果URL中有比赛ID参数，设置选中的比赛
    if (competitionIdFromUrl) {
      setSelectedCompetition(Number(competitionIdFromUrl));
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [selectedCompetition, selectedStatus, searchName]);

  const handleApprove = (id: number) => {
    Modal.confirm({
      title: '确认审核',
      content: '确定要通过此报名申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateRegistration(id, { status: 'approved' });
          message.success('已通过报名');
          fetchRegistrations();
        } catch (error) {
          console.error('操作失败', error);
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const handleReject = (id: number) => {
    Modal.confirm({
      title: '确认拒绝',
      content: '确定要拒绝此报名申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await updateRegistration(id, { status: 'rejected' });
          message.success('已拒绝报名');
          fetchRegistrations();
        } catch (error) {
          console.error('操作失败', error);
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const handleCancel = (id: number) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消这个选手的报名吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelRegistration(id);
          message.success('已取消报名');
          fetchRegistrations();
        } catch (error) {
          console.error('操作失败', error);
          message.error('操作失败，请重试');
        }
      },
    });
  };

  const columns = [
    {
      title: '选手',
      dataIndex: 'player',
      key: 'player',
      render: (player: any) => (
        <Space direction="vertical" size="small">
          <span>{player?.name || '未知选手'}</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{player?.username}</span>
        </Space>
      ),
    },
    {
      title: '比赛',
      dataIndex: 'competition',
      key: 'competition',
      render: (competition: any) => competition?.title || '未知比赛',
    },
    {
      title: '报名时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (record: any) => (
        <Space direction="vertical" size="small">
          <span>电话: {record.player?.phone || '未提供'}</span>
          <span>邮箱: {record.player?.email || '未提供'}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = '未知状态';
        
        switch (status) {
          case 'pending':
            color = 'blue';
            text = '待审核';
            break;
          case 'approved':
            color = 'green';
            text = '已通过';
            break;
          case 'rejected':
            color = 'red';
            text = '已拒绝';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                拒绝
              </Button>
            </>
          )}
          {record.status !== 'pending' && (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => handleCancel(record.id)}
            >
              取消报名
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>报名管理</Title>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <Form layout="inline" style={{ marginBottom: '24px' }}>
          <Form.Item label="比赛">
            <Select
              style={{ width: 200 }}
              placeholder="选择比赛"
              value={selectedCompetition}
              onChange={setSelectedCompetition}
              allowClear
            >
              {competitions.map((comp) => (
                <Option key={comp.id} value={comp.id}>
                  {comp.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="状态">
            <Select
              style={{ width: 120 }}
              placeholder="选择状态"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item label="选手搜索">
            <Input
              placeholder="选手姓名"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={fetchRegistrations}
              icon={<FilterOutlined />}
            >
              筛选
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={registrations}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default RegistrationsPage; 