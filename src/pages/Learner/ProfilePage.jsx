import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, Row, Col, Avatar, message, Upload, Space } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, CameraOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "../../hook/useAuth";
import { updateLearnerAPI, uploadAvatarAPI, getLearnerByIdAPI } from "../../service/api/api.learner";
import { getFullImageUrl } from "../../utils";

const { Title, Text } = Typography;

const ProfilePage = () => {
    const { user, loginSuccess } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) {
                setFetchLoading(false);
                return;
            }
            
            try {
                const res = await getLearnerByIdAPI(user.id);
                if (res && res.data) {
                    const data = res.data.data || res.data;
                    form.setFieldsValue({
                        fullName: data.fullName || data.name || "",
                        username: data.username || "",
                        phoneNumber: data.phoneNumber || "",
                        email: data.email || "", 
                    });
                    setAvatarUrl(data.avatarUrl || data.avatar || "");
                }
            } catch (error) {
                console.error("Fetch learner details error:", error);
                message.error("Không thể tải thông tin người dùng!");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchUserData();
    }, [user?.id, form, fetchLoading]);

    const handleUploadAvatar = async ({ file }) => {
        if (!user?.id) return;
        
        setUploading(true);
        try {
            const res = await uploadAvatarAPI(user.id, file);
            if (res && res.data) {
                // Adjust based on your API response structure
                const newAvatarUrl = res.data.avatarUrl || res.data.data?.avatarUrl || res.data.data?.avatar || res.data.data;
                if (newAvatarUrl) {
                    setAvatarUrl(newAvatarUrl);
                    message.success("Cập nhật ảnh đại diện thành công!");
                    
                    // Update user context with new avatar path
                    const accessToken = localStorage.getItem("access_token");
                    const updatedUser = { ...user, avatarUrl: newAvatarUrl };
                    loginSuccess(accessToken, null, updatedUser);
                }
            }
        } catch (error) {
            console.error("Upload avatar error:", error);
            message.error(error?.message || "Không thể tải lên ảnh đại diện!");
        } finally {
            setUploading(false);
        }
    };

    const onFinish = async (values) => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const updateData = {
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                username: values.username,
                avatarUrl: avatarUrl, 
            };

            const res = await updateLearnerAPI(user.id, updateData);
            
            if (res && res.data) {
                message.success("Cập nhật thông tin thành công!");
                
                const accessToken = localStorage.getItem("access_token");
                const updatedUser = {
                    ...user,
                    name: values.fullName,
                    fullName: values.fullName,
                    username: values.username,
                    phoneNumber: values.phoneNumber,
                    avatar: avatarUrl
                };
                
                loginSuccess(accessToken, null, updatedUser);
            }
        } catch (error) {
            console.error("Update profile error:", error);
            message.error(error?.message || "Cập nhật thất bại, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8 text-center">
                <Title level={2}>Thông tin cá nhân</Title>
            </div>

            <Row gutter={24}>
                <Col xs={24} md={8}>
                    <Card className="text-center shadow-sm rounded-2xl mb-6">
                        <div className="relative inline-block mb-4">
                            <Avatar 
                                size={120} 
                                src={getFullImageUrl(avatarUrl)} 
                                icon={uploading ? <LoadingOutlined /> : <UserOutlined />} 
                                className="border-4 border-blue-50 shadow-md"
                            />
                            <div className="absolute bottom-0 right-0">
                                <Upload
                                    name="avatar"
                                    showUploadList={false}
                                    customRequest={handleUploadAvatar}
                                    beforeUpload={(file) => {
                                        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                        if (!isJpgOrPng) {
                                            message.error('Bạn chỉ có thể tải lên tệp JPG/PNG!');
                                        }
                                        const isLt2M = file.size / 1024 / 1024 < 2;
                                        if (!isLt2M) {
                                            message.error('Hình ảnh phải nhỏ hơn 2MB!');
                                        }
                                        return isJpgOrPng && isLt2M;
                                    }}
                                >
                                    <Button 
                                        type="primary" 
                                        shape="circle" 
                                        icon={uploading ? <LoadingOutlined /> : <CameraOutlined />} 
                                        className="shadow-lg"
                                        loading={uploading}
                                    />
                                </Upload>
                            </div>
                        </div>
                        <Title level={4} className="mb-0">{user?.name || "Người dùng"}</Title>
                        <Text type="secondary">{user?.role || "Learner"}</Text>
                        
                        <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                            <Space direction="vertical" className="w-full">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MailOutlined />
                                    <span className="text-sm truncate w-full">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <PhoneOutlined />
                                    <span className="text-sm">{user?.phoneNumber || "Chưa cập nhật SĐT"}</span>
                                </div>
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card className="shadow-sm rounded-2xl" title="Chỉnh sửa chi tiết">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="fullName"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    >
                                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" size="large" className="rounded-xl" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        rules={[
                                            { pattern: /^[0-9+]*$/, message: 'Số điện thoại không hợp lệ!' }
                                        ]}
                                    >
                                        <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="09xxxxxxx" size="large" className="rounded-xl" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                    >
                                        <Input prefix={<MailOutlined className="text-gray-400" />} disabled size="large" className="rounded-xl" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item className="mb-0 mt-6">
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading} 
                                    icon={<SaveOutlined />}
                                    size="large"
                                    className="w-full h-12 rounded-xl shadow-lg shadow-blue-500/20"
                                >
                                    Lưu thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
