import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Tag, Divider, Button, Collapse } from "antd";

const { Title, Paragraph, Text } = Typography;

const WritingResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { feedback } = location.state || {};

  if (!feedback) return <div>No data found</div>;

  const items = [
    {
      key: "1",
      label: "Task Achievement",
      children: <p>{feedback.taskAchievement}</p>,
    },
    {
      key: "2",
      label: "Coherence & Cohesion",
      children: <p>{feedback.coherenceCohesion}</p>,
    },
    {
      key: "3",
      label: "Lexical Resource",
      children: <p>{feedback.lexicalResource}</p>,
    },
    {
      key: "4",
      label: "Grammatical Range",
      children: <p>{feedback.grammaticalRange}</p>,
    },
  ];

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card title={<Title level={2}>IELTS Writing Feedback</Title>}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 20 }}>Overall Band</Text>
          <br />
          <Tag
            color="gold"
            style={{ fontSize: 40, padding: "10px 20px", height: "auto" }}
          >
            {feedback.band}
          </Tag>
        </div>

        <Title level={4}>Detailed Analysis</Title>
        <Collapse items={items} defaultActiveKey={["1"]} />

        <Divider />
        <Title level={4}>Overall Feedback</Title>
        <Paragraph>{feedback.overallFeedback}</Paragraph>

        <Divider />
        <Title level={4}>Suggested Corrections</Title>
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
            fontStyle: "italic",
          }}
        >
          {feedback.correctedEssay}
        </div>

        <div style={{ marginTop: 30, textAlign: "center" }}>
          <Button
            type="primary"
            onClick={() => navigate("/exams?skill=WRITING")}
          >
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default WritingResult;
