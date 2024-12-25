import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import BarChart from "./examples/BarChart";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Button,
  FormGroup,
  Label,
  Input,
  Progress, 
} from "reactstrap";
import axios from "axios";
// import Header from "components/Headers/Header.js";
import DashboardHeader from "components/Headers/DashboardHeader";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [finishedExams, setFinishedExams] = useState([]);
  const [pausedExams, setPausedExams] = useState([]);
  const [pieChartData, setPieChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [mainTopics, setMainTopics] = useState([]);
  const [selectedMainTopic, setSelectedMainTopic] = useState('');
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFinished, setLoadingFinished] = useState(true);
  const [loadingPaused, setLoadingPaused] = useState(true);
  const [errorFinished, setErrorFinished] = useState(null);
  const [errorPaused, setErrorPaused] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Fetch finished exams
  useEffect(() => {
    const fetchFinishedExams = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = getCookie('token'); // Retrieve the token from cookies
  
        if (!userId) {
          setErrorFinished("User ID not found");
          setLoadingFinished(false);
          return;
        }
  
        if (!token) {
          setErrorFinished("Token not found");
          setLoadingFinished(false);
          return;
        }
  
        const response = await axios.post(
          `${apiUrl}/edjifnji/user/finished-exam/${userId}/eijhbci`,
          {}, // Body can be empty
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
              Id: userId,                        // Pass userId as Id in the headers
            },
          }
        );
  
        setFinishedExams(response.data.data.slice(-5)); // Only show last 5 finished exams
      } catch (error) {
        console.error("Error fetching finished exams:", error);
        setErrorFinished("Failed to load finished exams");
      } finally {
        setLoadingFinished(false);
      }
    };
  
    fetchFinishedExams();
  }, [apiUrl]);

  // Fetch paused exams
  useEffect(() => {
    const fetchPausedExams = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = getCookie('token'); // Retrieve token from cookies

        if (!userId) {
          setErrorPaused("User not authenticated");
          setLoadingPaused(false);
          return;
        }

        const response = await axios.post(
          `${apiUrl}/edjifnji/user/${userId}/eijhbci`,
          {}, // Body can be empty
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
              Id: userId, // Pass userId as Id in the headers
            },
          }
        );
        setPausedExams(response.data.data.slice(-5)); // Only show last 5 paused exams
      } catch (error) {
        console.error("Error fetching paused exams:", error);
        setErrorPaused("Failed to fetch data");
      } finally {
        setLoadingPaused(false);
      }
    };

    fetchPausedExams();
  }, [apiUrl]);

  const calculateCompletionPercentage = (answeredQuestionIds, pendingQuestionIds) => {
    const totalQuestions = answeredQuestionIds.length + pendingQuestionIds.length;
    if (totalQuestions === 0) return 0; // Prevent division by zero
    return ((answeredQuestionIds.length / totalQuestions) * 100).toFixed(2); // Round to two decimal places
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = getCookie('token'); // Retrieve token from cookies
  
        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }
  
        const response = await axios.post(
          `${apiUrl}/main-topics/${userId}/subtopic-percentages`,
          {}, // Body can be empty
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
              Id: userId, // Pass userId as Id in the headers
            },
          }
        );
  
        const data = response.data.data;
  
        // Prepare data for the pie chart (average percentage of subtopics per main topic)
        const pieLabels = data.map(topic => topic.mainTopicName);
        const pieData = data.map(topic => {
          const totalSubtopics = topic.subTopics.length;
          const totalPercentage = topic.subTopics.reduce((acc, sub) => acc + sub.averagePercentage, 0);
          return totalSubtopics ? parseFloat((totalPercentage / totalSubtopics).toFixed(2)) : 0;
        });
  
        setPieChartData({
          labels: pieLabels,
          datasets: [
            {
              label: 'Main Topic Average',
              data: pieData,
              backgroundColor: pieLabels.map(() => getRandomColor()),
            },
          ],
        });
  
        // Also set the main topics for the dropdown
        setMainTopics(data);
        if (data.length > 0) {
          setSelectedMainTopic(data[0].mainTopicId);
          setSubTopics(data[0].subTopics);
          setSelectedSubTopic(data[0].subTopics[0].subTopicId);
        }
  
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [apiUrl]);
  
  useEffect(() => {
    const fetchLineChartData = async () => {
      const userId = localStorage.getItem('userId');
      const token = getCookie('token'); // Retrieve token from cookies
  
      if (selectedMainTopic && selectedSubTopic && userId) {
        try {
          const response = await axios.get(
            `${apiUrl}/average-percentage?userId=${userId}&mainTopicId=${selectedMainTopic}&subTopicId=${selectedSubTopic}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                Id: userId, // Pass userId as Id in the headers
              },
            }
          );
  
          const lineData = response.data.data.chapters.map(chapter => chapter.averagePercentage);
          const lineLabels = response.data.data.chapters.map(chapter => chapter.chapterName);
  
          setLineChartData({
            labels: lineLabels,
            datasets: [
              {
                label: 'Chapter Average Percentage',
                data: lineData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching line chart data", error);
        }
      }
    };
  
    fetchLineChartData();
  }, [selectedMainTopic, selectedSubTopic, apiUrl]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleMainTopicChange = (e) => {
    const mainTopicId = e.target.value;
    const selectedTopic = mainTopics.find(topic => topic.mainTopicId === mainTopicId);
    setSelectedMainTopic(mainTopicId);
    setSubTopics(selectedTopic ? selectedTopic.subTopics : []);
    setSelectedSubTopic(selectedTopic?.subTopics[0]?.subTopicId || '');
  };

  const handleSubTopicChange = (e) => {
    setSelectedSubTopic(e.target.value);
  };

  const handleNavigateFinished = () => {
    navigate("/admin/finishedexams");
  };

  const handleNavigatePaused = () => {
    navigate("/admin/pauseexams");
  };

  return (
    <>
      <DashboardHeader />
      <Container className="mt--7" fluid>
        <Row className="mb-5">
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                    <h2 className="mb-0">Subtopics Performance Overview</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: "580px", maxHeight: "700px", overflow: "hidden" }}> {/* Increased height to 700px */}
                {loading ? (
                  <p>Loading bar chart...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div className="chart" style={{ height: "100%", width: "100%" }}> {/* Make the chart responsive */}
                    <BarChart />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Main Topics Pie Chart */}
        <Row className="mb-5">
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                    <h2 className="mb-0">Main Topics Average Percentage</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody style={{ height: "400px" }}>
                {loading ? (
                  <p>Loading pie chart...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div className="chart" style={{ height: "100%" }}>
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: true },
                          title: { display: true, text: 'Main Topics Average Percentage' },
                        },
                      }}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Dropdowns for selecting Main Topic and Subtopic */}
        <Row className="mb-5">
          <Col xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Chapter Performance</h6>
                    <h2 className="mb-0">Chapter-wise Performance</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="mainTopicSelect">Select Main Topic</Label>
                      <Input
                        type="select"
                        name="mainTopicSelect"
                        id="mainTopicSelect"
                        value={selectedMainTopic}
                        onChange={handleMainTopicChange}
                      >
                        {mainTopics.map(topic => (
                          <option key={topic.mainTopicId} value={topic.mainTopicId}>
                            {topic.mainTopicName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="subTopicSelect">Select Sub Topic</Label>
                      <Input
                        type="select"
                        name="subTopicSelect"
                        id="subTopicSelect"
                        value={selectedSubTopic}
                        onChange={handleSubTopicChange}
                      >
                        {subTopics.map(sub => (
                          <option key={sub.subTopicId} value={sub.subTopicId}>
                            {sub.subTopicName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Line Chart for Chapter Performance */}
                <div className="chart" style={{ height: "400px" }}>
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: true },
                        title: { display: true, text: 'Chapter-wise Average Percentage' },
                      },
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Recent Finished and Paused Exams */}
        <Row>
          <Col xl="6" className="mb-4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Recent Finished Exams</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm" onClick={handleNavigateFinished}>
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {loadingFinished ? (
                  <p>Loading...</p>
                ) : errorFinished ? (
                  <p>{errorFinished}</p>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Exam Name</th>
                        <th scope="col">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finishedExams.length > 0 ? (
                        finishedExams.map((exam, index) => (
                          <tr key={index}>
                            <th scope="row">{exam.examName}</th>
                            <td>{exam.correctAnswers}/{exam.totalQuestions}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">No exams found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col xl="6" className="mb-4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Recent Paused Exams</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm" onClick={handleNavigatePaused}>
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {loadingPaused ? (
                  <p>Loading...</p>
                ) : errorPaused ? (
                  <p>{errorPaused}</p>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Chapter Name</th>
                        <th scope="col">Completion</th> {/* Progress Completion Column */}
                      </tr>
                    </thead>
                    <tbody>
                      {pausedExams.length > 0 ? (
                        pausedExams.map((exam, index) => {
                          const completionPercentage = calculateCompletionPercentage(
                            exam.answeredQuestionIds,
                            exam.pendingQuestionIds
                          );
                          return (
                            <tr key={index}>
                              <th scope="row">{exam.chapterName}</th>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="mr-2">{completionPercentage}%</span>
                                  <div>
                                    <Progress
                                      max="100"
                                      value={completionPercentage}
                                      barClassName="bg-danger"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="3">No paused exams found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
