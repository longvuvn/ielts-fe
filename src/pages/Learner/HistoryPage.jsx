import React, { useEffect, useState, useCallback } from "react";
import { Table, Card, Typography, Tag, Space, Statistic, Row, Col, Spin, Empty } from "antd";
import { History, BookOpen, CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import { getLearnerHistoryAPI } from "../../service/api/api.learner";
import { useAuth } from "../../hook/useAuth";

const { Title, Text } = Typography;

const HistoryPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchHistory = useCallback(async (page, size) => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await getLearnerHistoryAPI(user.id, page - 1, size);
            if (res && res.data) {
                setHistoryData(res.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.totalExamsTaken || 0, // Dựa trên response API, có thể cần điều chỉnh nếu API trả về tổng số bản ghi phân trang khác
                }));
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchHistory(pagination.current, pagination.pageSize);
    }, [fetchHistory, pagination.current, pagination.pageSize]);

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    const columns = [
        {
            title: "Tên bài thi",
            dataIndex: "examTitle",
            key: "examTitle",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Điểm số",
            dataIndex: "score",
            key: "score",
            render: (score) => (
                <Tag color={parseFloat(score) >= 5 ? "green" : "volcano"}>
                    {score}
                </Tag>
            ),
        },
        {
            title: "Kết quả",
            key: "results",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text type="success" size="small">
                        <CheckCircle size={14} style={{ marginRight: 4, display: 'inline' }} />
                        Đúng: {record.correctQuestions}
                    </Text>
                    <Text type="danger" size="small">
                        <XCircle size={14} style={{ marginRight: 4, display: 'inline' }} />
                        Sai: {record.failedQuestions}
                    </Text>
                    <Text type="secondary" size="small">
                        Tổng: {record.totalQuestions}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "COMPLETED" ? "blue" : "orange"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Thời gian làm bài",
            key: "timing",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text size="small">
                        <Calendar size={14} style={{ marginRight: 4, display: 'inline' }} />
                        {record.completedAt ? new Date(record.completedAt).toLocaleDateString() : "N/A"}
                    </Text>
                    <Text type="secondary" size="small">
                        <Clock size={14} style={{ marginRight: 4, display: 'inline' }} />
                        {record.startTime} - {record.endTime}
                    </Text>
                </Space>
            ),
        },
    ];

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Empty description="Vui lòng đăng nhập để xem lịch sử" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Title level={2} className="flex items-center gap-2">
                    <History size={28} /> Lịch sử làm bài
                </Title>
                <Text type="secondary">Xem lại quá trình luyện tập và điểm số của bạn</Text>
            </div>

            {historyData && (
                <Row gutter={[16, 16]} className="mb-8">
                    <Col xs={24} sm={12} md={8}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Tổng số bài đã làm"
                                value={historyData.totalExamsTaken}
                                prefix={<BookOpen className="text-blue-500 mr-2" size={20} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card bordered={false} className="shadow-sm">
                            <Statistic
                                title="Điểm trung bình"
                                value={historyData.averageScore}
                                precision={1}
                                prefix={<CheckCircle className="text-green-500 mr-2" size={20} />}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Card className="shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={historyData?.submissions || []}
                    rowKey="submissionId"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                />
            </Card>
        </div>
    );
};

export default HistoryPage;
