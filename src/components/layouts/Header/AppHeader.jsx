import {
  DownOutlined,
  EditOutlined,
  ReadOutlined,
  AudioOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const navigate = useNavigate();

  const items = [
    { label: "Listening", key: "LISTENING", icon: <CustomerServiceOutlined /> },
    { label: "Reading", key: "READING", icon: <ReadOutlined /> },
    { label: "Writing", key: "WRITING", icon: <EditOutlined /> },
    { label: "Speaking", key: "SPEAKING", icon: <AudioOutlined /> },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(`/exams?skill=${key}`);
  };

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {" "}
          Practice Skills <DownOutlined />{" "}
        </Space>
      </a>
    </Dropdown>
  );
};
export default AppHeader;
