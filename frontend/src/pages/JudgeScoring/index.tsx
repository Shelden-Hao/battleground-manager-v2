import React, { useState, useEffect } from 'react';
import { Card, Table, Button, InputNumber, Form, message, Space, Typography } from 'antd';
import { history } from '@umijs/max';

const { Title } = Typography;

interface Contestant {
  id: number;
  name: string;
  score?: number;
}

// 本地存储key
const STORAGE_KEY = 'judge_scoring_data';

const JudgeScoringPage: React.FC = () => {
  const [form] = Form.useForm();
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 初始化32个选手
  const initializeContestants = () => {
    const newContestants = Array.from({ length: 32 }, (_, index) => ({
      id: index + 1,
      name: `选手${index + 1}`,
      score: undefined
    }));
    setContestants(newContestants);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContestants));
  };

  // 初始化选手数据
  useEffect(() => {
    // 从localStorage获取数据
    const storageData = localStorage.getItem(STORAGE_KEY);
    if (storageData) {
      try {
        setContestants(JSON.parse(storageData));
      } catch (error) {
        initializeContestants();
      }
    } else {
      initializeContestants();
    }
  }, []);

  // 保存评分
  const handleSaveScores = () => {
    setLoading(true);
    try {
      // 收集所有评分
      form.validateFields().then(values => {
        const updatedContestants = contestants.map(contestant => {
          const score = values[`score_${contestant.id}`];
          return {
            ...contestant,
            score: score !== undefined ? score : contestant.score
          };
        });
        
        // 保存到localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContestants));
        setContestants(updatedContestants);
        message.success('评分已保存');
      });
    } catch (error) {
      message.error('评分保存失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置评分
  const handleResetScores = () => {
    form.resetFields();
    initializeContestants();
    message.info('评分已重置');
  };

  // 表格列配置
  const columns = [
    {
      title: '选手ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '选手姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '评分',
      key: 'score',
      render: (_: any, record: Contestant) => (
        <Form.Item
          name={`score_${record.id}`}
          initialValue={record.score}
          rules={[
            { 
              type: 'number',
              min: 0,
              max: 100,
              message: '评分必须在0-100之间',
            },
          ]}
          noStyle
        >
          <InputNumber
            min={0}
            max={100}
            precision={0}
            placeholder="0-100分"
            style={{ width: '100px' }}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>裁判评分</Title>
      
      <Form form={form} layout="vertical">
        <Table
          rowKey="id"
          dataSource={contestants}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
        
        <Space style={{ marginTop: 16 }}>
          <Button type="primary" onClick={handleSaveScores} loading={loading}>
            保存评分
          </Button>
          <Button onClick={handleResetScores}>重置</Button>
          <Button onClick={() => history.push('/judge-matches')}>返回</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default JudgeScoringPage;