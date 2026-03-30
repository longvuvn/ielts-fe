import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Typography, Space, Modal, Form, 
  Input, message, Popconfirm, Drawer, Tag 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, BookOutlined, TagOutlined 
} from '@ant-design/icons';
import { getAllTopicsAPI } from '../../service/api/api.topic';
import { 
  getVocabulariesByTopicAPI, 
  updateVocabularyAPI, 
  deleteVocabularyAPI 
} from '../../service/api/api.admin';
import { createVocabularyAPI } from '../../service/api/api.vocabulary';

const { Title, Text } = Typography;

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [showVocabDrawer, setShowVocabDrawer] = useState(false);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await getAllTopicsAPI();
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData && Array.isArray(responseData.content)) {
        finalData = responseData.content;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalData = responseData.data;
      }
      setTopics(finalData);
    } catch (error) {
      message.error('Không thể tải danh sách chủ đề!');
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabularies = async (topicId) => {
    try {
      setVocabLoading(true);
      const res = await getVocabulariesByTopicAPI(topicId);
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData && Array.isArray(responseData.content)) {
        finalData = responseData.content;
      } else if (responseData && Array.isArray(responseData.data)) {
        finalData = responseData.data;
      }
      setVocabularies(finalData);
    } catch (error) {
      message.error('Không thể tải danh sách từ vựng!');
    } finally {
      setVocabLoading(false);
    }
  };

  const handleShowVocabs = (topic) => {
    setSelectedTopic(topic);
    fetchVocabularies(topic.id);
    setShowVocabDrawer(true);
  };

  const handleAddVocab = () => {
    setEditingVocab(null);
    form.resetFields();
    setShowVocabModal(true);
  };

  const handleEditVocab = (vocab) => {
    setEditingVocab(vocab);
    form.setFieldsValue(vocab);
    setShowVocabModal(true);
  };

  const handleDeleteVocab = async (id) => {
    try {
      const res = await deleteVocabularyAPI(id);
      if (res?.status === 200) {
        message.success('Đã xóa từ vựng!');
        fetchVocabularies(selectedTopic.id);
      }
    } catch (error) {
      message.error('Lỗi khi xóa từ vựng!');
    }
  };

  const onFinishVocab = async (values) => {
    try {
      if (editingVocab) {
        await updateVocabularyAPI(editingVocab.id, { ...values, topicId: selectedTopic.id });
        message.success('Đã cập nhật từ vựng!');
      } else {
        await createVocabularyAPI(
          selectedTopic.id, values.word, values.ipa, values.example, 
          values.audio_url, values.definition, values.part_of_speech
        );
        message.success('Đã thêm từ vựng mới!');
      }
      setShowVocabModal(false);
      fetchVocabularies(selectedTopic.id);
    } catch (error) {
      message.error('Lỗi khi lưu từ vựng!');
    }
  };

  const topicColumns = [
    {
      title: 'Tên Chủ đề',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Space><TagOutlined className="text-blue-500" /><Text strong>{text}</Text></Space>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          ghost 
          icon={<EyeOutlined />} 
          onClick={() => handleShowVocabs(record)}
        >
          Xem từ vựng
        </Button>
      ),
    },
  ];

  const vocabColumns = [
    { title: 'Từ vựng', dataIndex: 'word', key: 'word', render: (text) => <Text strong>{text}</Text> },
    { title: 'Phiên âm', dataIndex: 'ipa', key: 'ipa' },
    { title: 'Loại từ', dataIndex: 'part_of_speech', key: 'part_of_speech', render: (pos) => <Tag color="orange">{pos}</Tag> },
    { title: 'Định nghĩa', dataIndex: 'definition', key: 'definition', ellipsis: true },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => handleEditVocab(record)} />
          <Popconfirm title="Xóa từ vựng này?" onConfirm={() => handleDeleteVocab(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>Quản lý Chủ đề & Từ vựng</Title>
        <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 rounded-lg">Thêm Chủ đề</Button>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-xl">
        <Table 
          columns={topicColumns} 
          dataSource={topics} 
          loading={loading}
          rowKey="id"
        />
      </Card>

      {/* VOCABULARY DRAWER */}
      <Drawer
        title={`Từ vựng trong chủ đề: ${selectedTopic?.name}`}
        width={800}
        onClose={() => setShowVocabDrawer(false)}
        open={showVocabDrawer}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVocab}>
            Thêm từ vựng
          </Button>
        }
      >
        <Table 
          columns={vocabColumns} 
          dataSource={vocabularies} 
          loading={vocabLoading}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Drawer>

      {/* VOCABULARY MODAL */}
      <Modal
        title={editingVocab ? 'Sửa từ vựng' : 'Thêm từ vựng mới'}
        open={showVocabModal}
        onCancel={() => setShowVocabModal(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinishVocab} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="word" label="Từ vựng" rules={[{ required: true }]}>
              <Input placeholder="e.g. Accomplish" />
            </Form.Item>
            <Form.Item name="ipa" label="Phiên âm">
              <Input placeholder="e.g. /əˈkʌm.plɪʃ/" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="part_of_speech" label="Loại từ">
              <Input placeholder="e.g. verb, noun..." />
            </Form.Item>
            <Form.Item name="audio_url" label="Link Audio">
              <Input placeholder="https://..." />
            </Form.Item>
          </div>
          <Form.Item name="definition" label="Định nghĩa" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Nghĩa của từ..." />
          </Form.Item>
          <Form.Item name="example" label="Ví dụ">
            <Input.TextArea rows={2} placeholder="Câu ví dụ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicPage;
