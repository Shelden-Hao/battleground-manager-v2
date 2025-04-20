import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, message, Typography, Form, Input, DatePicker, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from '@/services/competition';
import { history, useAccess } from '@umijs/max';
import moment from 'moment';
import styles from './index.less';

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CompetitionsPage: React.FC = () => {
  const [competitions, setCompetitions] = useState<API.Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState<API.Competition | null>(null);
  const [form] = Form.useForm();
  
  const access = useAccess();
  const isAdmin = access.isAdmin;
  
  useEffect(() => {
    fetchCompetitions();
  }, []);
  
  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await getCompetitions();
      setCompetitions(res || []);
    } catch (error) {
      console.error('获取比赛列表失败', error);
      message.error('获取比赛列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = () => {
    setCurrentCompetition(null);
    form.resetFields();
    setModalVisible(true);
  };
  
  const handleEdit = (record: API.Competition) => {
    setCurrentCompetition(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      dateRange: [moment(record.start_date), moment(record.end_date)],
    });
    setModalVisible(true);
  };
  
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个比赛吗？所有相关数据也将被删除！',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCompetition(id);
          message.success('删除成功');
          fetchCompetitions();
        } catch (error) {
          console.error('删除失败', error);
          message.error('删除失败');
        }
      },
    });
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      const competitionData = {
        title: values.title,
        description: values.description,
        start_date: values.dateRange[0].format('YYYY-MM-DD'),
        end_date: values.dateRange[1].format('YYYY-MM-DD'),
      };
      
      if (currentCompetition) {
        // 更新比赛
        await updateCompetition(currentCompetition.id, competitionData);
        message.success('更新成功');
      } else {
        // 创建比赛
        await createCompetition(competitionData);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      fetchCompetitions();
    } catch (error) {
      console.error('操作失败', error);
      message.error('操作失败，请检查表单');
    } finally {
      setConfirmLoading(false);
    }
  };
  
  const columns = [
    {
      title: '比赛名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '结束日期',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = '未知状态';
        
        switch (status) {
          case 'draft':
            color = 'default';
            text = '草稿';
            break;
          case 'published':
            color = 'blue';
            text = '已发布';
            break;
          case 'in_progress':
            color = 'green';
            text = '进行中';
            break;
          case 'completed':
            color = 'red';
            text = '已结束';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.Competition) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => history.push(`/competitions/${record.id}`)}
          >
            查看
          </Button>
          
          {isAdmin && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                编辑
              </Button>
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
              >
                删除
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];
  
  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2}>比赛管理</Title>
        </Col>
        <Col>
          {isAdmin && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              创建比赛
            </Button>
          )}
        </Col>
      </Row>
      
      <Card>
        <Table 
          rowKey="id"
          columns={columns} 
          dataSource={competitions}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      
      <Modal
        title={currentCompetition ? '编辑比赛' : '创建比赛'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item 
            name="title"
            label="比赛名称"
            rules={[{ required: true, message: '请输入比赛名称' }]}
          >
            <Input placeholder="请输入比赛名称" />
          </Form.Item>
          
          <Form.Item 
            name="description"
            label="比赛描述"
            rules={[{ required: true, message: '请输入比赛描述' }]}
          >
            <TextArea rows={4} placeholder="请输入比赛描述" />
          </Form.Item>
          
          <Form.Item 
            name="dateRange"
            label="比赛日期"
            rules={[{ required: true, message: '请选择比赛日期' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CompetitionsPage; 