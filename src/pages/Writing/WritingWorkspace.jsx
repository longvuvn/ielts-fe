import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Input, Button, Typography, Spin, message } from "antd";
import {
  getQuestionByExamIdAPI,
  gradeWritingAPI,
} from "../../service/api/api.writing";

const { Title } = Typography;
const { TextArea } = Input;

const WritingWorkspace = () => {
  const { examId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const res = await getQuestionByExamIdAPI(examId);
      // Giả sử lấy question đầu tiên của Section
      if (res.data && res.data[0]?.passageResponses[0]?.questions[0]) {
        setQuestion(res.data[0].passageResponses[0].questions[0]);
      }
    };
    loadData();
  }, [examId]);

  const handleSubmit = async () => {
    if (answer.split(" ").length < 50) {
      return message.warning("Your essay is too short!");
    }
    setLoading(true);
    try {
      const res = await gradeWritingAPI(question.id, answer);
      navigate("/writing/result", { state: { feedback: res.data } });
    } catch (error) {
      message.error("Grading failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <Spin size="large" />;

  return (
    <Row gutter={24} style={{ padding: "20px", height: "90vh" }}>
      <Col
        span={10}
        style={{ borderRight: "1px solid #ddd", overflowY: "auto" }}
      >
        <Title level={4}>Question</Title>
        <div dangerouslySetInnerHTML={{ __html: question.content }} />
      </Col>
      <Col span={14}>
        <Title level={4}>Your Essay</Title>
        <TextArea
          rows={20}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your essay here..."
        />
        <div style={{ marginTop: 10, textAlign: "right" }}>
          <span style={{ marginRight: 20 }}>
            Words:{" "}
            {
              answer
                .trim()
                .split(/\s+/)
                .filter((x) => x).length
            }
          </span>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={loading}
          >
            Submit & Grade with AI
          </Button>
        </div>
      </Col>
    </Row>
  );
};
export default WritingWorkspace;
