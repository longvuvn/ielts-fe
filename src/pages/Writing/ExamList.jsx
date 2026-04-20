import { useEffect, useState } from "react";
import { Card, List, Button, Tag } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllExamsAPI } from "../../service/api/api.writing";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [searchParams] = useSearchParams();
  const skill = searchParams.get("skill") || "WRITING";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const res = await getAllExamsAPI(0, 10, skill);
      if (res.data) setExams(res.data.content);
    };
    fetchExams();
  }, [skill]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>IELTS {skill} Exams</h2>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={exams}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>
              <p>Duration: {item.duration} mins</p>
              <Button
                type="primary"
                onClick={() => navigate(`/writing/practice/${item.id}`)}
              >
                Start Test
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default ExamList;
