import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Select, Form, Typography, Row, Col, Tag, Space, DatePicker, message } from 'antd';
import { SearchOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import { getMatches } from '@/services/match';
import { getCompetitions } from '@/services/competition';
import { history } from '@umijs/max';
import moment from 'moment';
import styles from './index.less';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterValues {
  competition_id?: number;
  status?: string;
  date_range?: [moment.Moment, moment.Moment];
}

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<API.Match[]>([]);
  const [competitions, setCompetitions] = useState<API.Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCompetitions();
    fetchMatches();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await getCompetitions();
      setCompetitions(res || []);
    } catch (error) {
      console.error('获取比赛列表失败:', error);
      message.error('获取比赛列表失败');
    }
  };

  const fetchMatches = async (filters?: FilterValues) => {
    setLoading(true);
    try {
      const params: any = { ...filters };
      
      if (params.date_range) {
        // 根据日期范围过滤，实际API上可能需要调整
        const [start, end] = params.date_range;
        params.start_date = start.format('YYYY-MM-DD');
        params.end_date = end.format('YYYY-MM-DD');
        delete params.date_range;
      }
      
      const res = await getMatches(params);
      setMatches(res || []);
    } catch (error) {
      console.error('获取比赛对阵列表失败:', error);
      message.error('获取比赛对阵列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: FilterValues) => {
    fetchMatches(values);
  };

  const handleReset = () => {
    form.resetFields();
    fetchMatches();
  };

  const columns = [
    {
      title: '比赛',
      key: 'competition',
      render: (record: API.Match) => (
        <span>{competitions.find(c => c.id === record.competition_id)?.title || '未知比赛'}</span>
      ),
    },
    {
      title: '对阵',
      key: 'players',
      render: (record: API.Match) => (
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
      title: '阶段/小组',
      key: 'stage_group',
      render: (record: API.Match) => (
        <Space direction="vertical" size={0}>
          <span>
            {record.group ? (
              <Tag color="blue">{record.group.name}</Tag>
            ) : (
              <Tag>淘汰赛</Tag>
            )}
          </span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'pending':
            color = 'default';
            text = '未开始';
            break;
          case 'in_progress':
            color = 'processing';
            text = '进行中';
            break;
          case 'completed':
            color = 'success';
            text = '已完成';
            break;
          default:
            color = 'default';
            text = '未知';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '比赛时间',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time?: string) => time ? moment(time).format('YYYY-MM-DD HH:mm') : '待定',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: API.Match) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => history.push(`/matches/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2}>比赛对阵</Title>
        </Col>
      </Row>
      
      <Card className={styles.filterCard}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          className={styles.filterForm}
        >
          <Form.Item name="competition_id" label="比赛">
            <Select
              placeholder="选择比赛"
              style={{ width: 200 }}
              allowClear
            >
              {competitions.map(competition => (
                <Option key={competition.id} value={competition.id}>{competition.title}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select
              placeholder="选择状态"
              style={{ width: 150 }}
              allowClear
            >
              <Option value="pending">未开始</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="date_range" label="时间范围">
            <RangePicker style={{ width: 250 }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          
          <Form.Item>
            <Button onClick={handleReset}>重置</Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={matches}
          columns={columns}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default MatchesPage; 