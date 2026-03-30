import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Card, Typography, Space, Modal, Form, 
  Input, message, Popconfirm, Tag, Select, Empty
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  BookOutlined, TagOutlined, FilterOutlined,
  ImportOutlined, FileExcelOutlined, UploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getAllTopicsAPI } from '../../service/api/api.topic';
import { 
  getVocabulariesByTopicAPI, 
  updateVocabularyAPI, 
  deleteVocabularyAPI 
} from '../../service/api/api.admin';
import { createVocabularyAPI, importExcelVocabularyAPI } from '../../service/api/api.vocabulary';

const { Title, Text } = Typography;
const { Option } = Select;

const TopicPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importTopicId, setImportTopicId] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await getAllTopicsAPI();
      const responseData = res?.data?.data || res?.data || res;
      
      let finalData = [];
      if (Array.isArray(responseData)) {
        finalData = responseData;
      } else if (responseData?.content && Array.isArray(responseData.content)) {
        finalData = responseData.content;
      }
      
      setTopics(finalData);
      
      if (finalData.length > 0) {
        const firstId = finalData[0].id;
        setSelectedTopicId(firstId);
        setImportTopicId(firstId);
        fetchVocabularies(firstId, 1, 10);
      }
    } catch (error) {
      console.error("Fetch topics error:", error);
      message.error('Không thể tải danh sách chủ đề!');
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabularies = async (topicId, page = 1, size = 10) => {
    if (!topicId) return;
    try {
      setVocabLoading(true);
      // Backend expects 0-based index for pages (Spring Data default)
      const res = await getVocabulariesByTopicAPI(topicId, page - 1, size);
      const responseData = res?.data || res;
      
      // Handle Spring Data Page structure
      let content = [];
      let total = 0;

      if (responseData?.data) {
        // Nested data structure
        const d = responseData.data;
        content = d.content || d.result || (Array.isArray(d) ? d : []);
        total = d.totalElements || d.total || content.length;
      } else {
        content = responseData.content || responseData.result || (Array.isArray(responseData) ? responseData : []);
        total = responseData.totalElements || responseData.total || content.length;
      }
      
      setVocabularies(content);
      setTotalElements(total);
      setCurrentPage(page);
      setPageSize(size);
    } catch (error) {
      console.error("Fetch vocab error:", error);
      message.error('Không thể tải danh sách từ vựng!');
    } finally {
      setVocabLoading(false);
    }
  };

  const handleTopicChange = (value) => {
    setSelectedTopicId(value);
    setImportTopicId(value);
    fetchVocabularies(value, 1, pageSize);
  };

  const handleTableChange = (pagination) => {
    fetchVocabularies(selectedTopicId, pagination.current, pagination.pageSize);
  };

  const handleAddVocab = () => {
    if (!selectedTopicId) {
      message.warning("Vui lòng chọn một chủ đề trước!");
      return;
    }
    setEditingVocab(null);
    form.resetFields();
    setShowVocabModal(true);
  };

  const handleOpenImport = () => {
    setImportFile(null);
    if (selectedTopicId) {
      setImportTopicId(selectedTopicId);
    }
    setShowImportModal(true);
  };

  const handleImportExcel = async () => {
    if (!importFile) {
      message.error("Vui lòng chọn file Excel!");
      return;
    }
    if (!importTopicId) {
      message.error("Vui lòng chọn chủ đề để import vào!");
      return;
    }

    try {
      setImportLoading(true);
      const res = await importExcelVocabularyAPI(importFile, importTopicId);
      if (res?.status === 200 || res?.status === 201) {
        message.success("Import từ vựng thành công!");
        setShowImportModal(false);
        if (importTopicId === selectedTopicId) {
          fetchVocabularies(selectedTopicId, 1, pageSize);
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      message.error(error?.message || "Lỗi khi import file Excel!");
    } finally {
      setImportLoading(false);
    }
  };

  const handleEditVocab = (vocab) => {
    setEditingVocab(vocab);
    form.setFieldsValue(vocab);
    setShowVocabModal(true);
  };

  const handleDeleteVocab = async (id) => {
    try {
      const res = await deleteVocabularyAPI(id);
      if (res?.status === 200 || res?.status === 204) {
        message.success('Đã xóa từ vựng!');
        fetchVocabularies(selectedTopicId, currentPage, pageSize);
      }
    } catch {
      message.error('Lỗi khi xóa từ vựng!');
    }
  };

  const onFinishVocab = async (values) => {
    try {
      if (editingVocab) {
        await updateVocabularyAPI(editingVocab.id, { ...values, topicId: selectedTopicId });
        message.success('Đã cập nhật từ vựng!');
      } else {
        await createVocabularyAPI(
          selectedTopicId, values.word, values.ipa, values.example, 
          values.audio_url, values.definition, values.part_of_speech
        );
        message.success('Đã thêm từ vựng mới!');
      }
      setShowVocabModal(false);
      fetchVocabularies(selectedTopicId, currentPage, pageSize);
    } catch {
      message.error('Lỗi khi lưu từ vựng!');
    }
  };

  const vocabColumns = [
    { 
      title: 'Từ vựng', 
      dataIndex: 'word', 
      key: 'word', 
      render: (text) => <Text strong className="text-blue-600">{text}</Text> 
    },
    { 
      title: 'Phiên âm', 
      dataIndex: 'ipa', 
      key: 'ipa',
      render: (text) => <span className="font-mono text-slate-400">{text}</span>
    },
    { 
      title: 'Loại từ', 
      dataIndex: 'part_of_speech', 
      key: 'part_of_speech', 
      width: 120,
      render: (pos) => (
        <div className="flex flex-wrap gap-1">
          {pos?.split(',').map((p, index) => (
            <Tag key={index} color="blue" className="rounded-md uppercase font-bold text-[10px] m-0 break-words whitespace-normal">
              {p.trim()}
            </Tag>
          ))}
        </div>
      )
    },
    { 
      title: 'Định nghĩa', 
      dataIndex: 'definition', 
      key: 'definition', 
      ellipsis: true 
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => handleEditVocab(record)} 
          />
          <Popconfirm 
            title="Xóa từ vựng này?" 
            onConfirm={() => handleDeleteVocab(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-slide-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <Title level={2} className="m-0 font-black text-slate-900 tracking-tight">Quản lý Từ vựng</Title>
          <Text type="secondary" className="text-lg font-medium">Lọc và quản lý kho từ vựng theo từng chủ đề.</Text>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chọn chủ đề</span>
            <Select
              placeholder="Chọn chủ đề để lọc..."
              style={{ width: 220 }}
              className="custom-select"
              size="large"
              value={selectedTopicId}
              onChange={handleTopicChange}
              loading={loading}
            >
              {topics.map(topic => (
                <Option key={topic.id} value={topic.id}>
                  <Space>
                    <TagOutlined />
                    {topic.name}
                  </Space>
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex gap-3 mt-5">
            <Button 
              size="large"
              icon={<ImportOutlined />} 
              onClick={handleOpenImport}
              className="h-[50px] px-6 rounded-2xl border-2 border-emerald-500 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold"
            >
              Import Excel
            </Button>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />} 
              onClick={handleAddVocab}
              className="h-[50px] px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold"
            >
              Thêm từ mới
            </Button>
          </div>
        </div>
      </div>

      {/* VOCABULARY TABLE */}
      <Card 
        className="shadow-xl border-slate-100 rounded-[32px] overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        {!selectedTopicId ? (
          <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div className="text-center">
                  <p className="text-slate-500 font-bold text-lg">Chưa có chủ đề nào được chọn</p>
                  <p className="text-slate-400">Vui lòng chọn một chủ đề từ danh sách bên trên để xem từ vựng.</p>
                </div>
              } 
            />
          </div>
        ) : (
          <Table 
            columns={vocabColumns} 
            dataSource={vocabularies} 
            loading={vocabLoading}
            rowKey="id"
            pagination={{ 
              current: currentPage,
              pageSize: pageSize,
              total: totalElements,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Tổng số {total} từ vựng</span>,
              className: "px-8 py-6"
            }}
            onChange={handleTableChange}
            className="custom-table"
          />
        )}
      </Card>

      {/* IMPORT MODAL */}
      <Modal
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileExcelOutlined size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 m-0">Import từ vựng từ Excel</h3>
              <p className="text-xs text-slate-400 font-medium m-0">Đưa hàng loạt từ vựng vào hệ thống</p>
            </div>
          </div>
        }
        open={showImportModal}
        onCancel={() => setShowImportModal(false)}
        onOk={handleImportExcel}
        okText="Bắt đầu Import"
        cancelText="Hủy bỏ"
        confirmLoading={importLoading}
        width={550}
        okButtonProps={{ size: 'large', className: 'rounded-xl px-8 font-bold bg-emerald-600 hover:bg-emerald-700 border-none' }}
        cancelButtonProps={{ size: 'large', className: 'rounded-xl px-8' }}
        centered
      >
        <div className="py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Chọn chủ đề đích *</span>
            <Select
              placeholder="Chọn chủ đề để import vào..."
              className="w-full h-14 custom-select-large"
              size="large"
              value={importTopicId}
              onChange={(val) => setImportTopicId(val)}
            >
              {topics.map(topic => (
                <Option key={topic.id} value={topic.id}>
                  <Space>
                    <TagOutlined className="text-slate-400" />
                    <span className="font-bold text-slate-700">{topic.name}</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-full">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Tệp dữ liệu (Excel) *</span>
            <div 
              className={`relative border-2 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center transition-all ${
                importFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/20'
              }`}
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setImportFile(e.target.files[0])}
              />
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${importFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {importFile ? <CheckCircleOutlined size={28} /> : <UploadOutlined size={28} />}
              </div>
              <p className={`font-bold text-center m-0 ${importFile ? 'text-emerald-700' : 'text-slate-500'}`}>
                {importFile ? importFile.name : 'Kéo thả file Excel vào đây'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Hỗ trợ: .xlsx, .xls</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lưu ý kỹ thuật:</h4>
            <ul className="text-[11px] text-slate-500 space-y-1 pl-4 list-disc font-medium">
              <li>File phải có cấu trúc cột chuẩn (Word, Definition, IPA, POS...).</li>
              <li>Chủ đề đã chọn sẽ được gán cho toàn bộ từ vựng trong file này.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* VOCABULARY MODAL */}
      <Modal
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              {editingVocab ? <EditOutlined size={20} /> : <PlusOutlined size={20} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 m-0">{editingVocab ? 'Cập nhật từ vựng' : 'Thêm từ vựng mới'}</h3>
              <p className="text-xs text-slate-400 font-medium m-0">Chủ đề: {topics.find(t => t.id === selectedTopicId)?.name}</p>
            </div>
          </div>
        }
        open={showVocabModal}
        onCancel={() => setShowVocabModal(false)}
        onOk={() => form.submit()}
        okText={editingVocab ? "Cập nhật ngay" : "Thêm vào kho"}
        cancelText="Hủy bỏ"
        width={650}
        okButtonProps={{ size: 'large', className: 'rounded-xl px-8 font-bold' }}
        cancelButtonProps={{ size: 'large', className: 'rounded-xl px-8' }}
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinishVocab} className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item 
              name="word" 
              label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Từ vựng *</span>} 
              rules={[{ required: true, message: 'Nhập từ vựng!' }]}
            >
              <Input className="h-12 rounded-xl bg-slate-50 border-slate-50" placeholder="e.g. Persistence" />
            </Form.Item>
            <Form.Item 
              name="ipa" 
              label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phiên âm (IPA)</span>}
            >
              <Input className="h-12 rounded-xl bg-slate-50 border-slate-50" placeholder="e.g. /pəˈsɪs.təns/" />
            </Form.Item>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Form.Item 
              name="part_of_speech" 
              label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại từ</span>}
            >
              <Select className="h-12 rounded-xl custom-select-form" placeholder="Chọn loại từ...">
                <Option value="noun">Danh từ (Noun)</Option>
                <Option value="verb">Động từ (Verb)</Option>
                <Option value="adjective">Tính từ (Adj)</Option>
                <Option value="adverb">Trạng từ (Adv)</Option>
                <Option value="preposition">Giới từ</Option>
              </Select>
            </Form.Item>
            <Form.Item 
              name="audio_url" 
              label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Đường dẫn âm thanh</span>}
            >
              <Input className="h-12 rounded-xl bg-slate-50 border-slate-50" placeholder="https://..." />
            </Form.Item>
          </div>

          <Form.Item 
            name="definition" 
            label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Định nghĩa *</span>} 
            rules={[{ required: true, message: 'Nhập định nghĩa!' }]}
          >
            <Input.TextArea rows={3} className="rounded-xl bg-slate-50 border-slate-50 p-4" placeholder="Nghĩa của từ vựng..." />
          </Form.Item>
          
          <Form.Item 
            name="example" 
            label={<span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ví dụ minh họa</span>}
          >
            <Input.TextArea rows={3} className="rounded-xl bg-slate-50 border-slate-50 p-4" placeholder="Câu ví dụ thực tế..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicPage;
