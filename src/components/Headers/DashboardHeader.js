import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import axios from "axios";

const DashboardHeader = () => {
  const [stats, setStats] = useState({
    pausedExams: 0,
    finishedExams: 0,
    averageScore: 0,
    attemptedInMonth: 0,
    attemptedInDay: 0,
    attemptedInWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const token = getCookie("token"); // Retrieve the token from cookies

          if (!userId) {
            throw new Error("User ID not found in localStorage");
          }

          if (!token) {
            throw new Error("Token not found in cookies");
          }

          // Headers with Authorization and Id
          const headers = {
            Authorization: `Bearer ${token}`,
            Id: userId,
          };

          // Fetch exam stats (finished and paused exams)
          const examStatsResponse = await axios.post(
            `${apiUrl}/status/${userId}`,
            {}, // Body can be empty
            { headers }
          );

          // Fetch average scores from subtopic percentages
          const scoreResponse = await axios.post(
            `${apiUrl}/main-topics/${userId}/subtopic-percentages`,
            {},
            { headers }
          );

          // Fetch attempted questions stats
          const attemptedResponse = await axios.get(
            `${apiUrl}/ijvihebvuheb/attempted-questions?userId=${userId}`,
            { headers }
          );

          if (examStatsResponse.data && examStatsResponse.data.data) {
            const examStats = examStatsResponse.data.data;
            setStats((prevStats) => ({
              ...prevStats,
              finishedExams: examStats.finishedExams,
              pausedExams: examStats.pausedExams,
            }));
          } else {
            console.error("Failed to load exam stats");
          }

          if (scoreResponse.data && scoreResponse.data.data) {
            const mainTopics = scoreResponse.data.data;
    
            // Calculate the average percentage across all subtopics, excluding `0.0`
            let totalPercentage = 0;
            let validSubTopicCount = 0;
    
            mainTopics.forEach((topic) => {
              topic.subTopics.forEach((subTopic) => {
                if (subTopic.averagePercentage > 0) { // Exclude `0.0` values
                  totalPercentage += subTopic.averagePercentage;
                  validSubTopicCount += 1;
                }
              });
            });
    
            const averageScore = validSubTopicCount > 0
              ? (totalPercentage / validSubTopicCount).toFixed(2) // Calculate average
              : 0; // Avoid division by zero
    
            setStats((prevStats) => ({
              ...prevStats,
              averageScore,
            }));
          } else {
            console.error("Failed to load exam scores");
          }

          if (attemptedResponse.data && attemptedResponse.data.data) {
            const attemptedData = attemptedResponse.data.data;
            setStats((prevStats) => ({
              ...prevStats,
              attemptedInMonth: attemptedData.attemptedInMonth,
              attemptedInDay: attemptedData.attemptedInDay,
              attemptedInWeek: attemptedData.attemptedInWeek,
            }));
          } else {
            console.error("Failed to load attempted questions data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, [apiUrl]);

  if (loading) {
    return (
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col className="text-center">
                <p>Loading statistics...</p>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );
  }

  const cardStyle = {
    height: '100px', // Set uniform height for all cards
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Finished exams
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.finishedExams}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Paused exams
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.pausedExams}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Exam scores
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.averageScore}%
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Attempted In Month
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.attemptedInMonth}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-calendar-alt" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Attempted In Week
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.attemptedInWeek}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-calendar-week" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="4" xl="4">
                <Card className="card-stats mb-4" style={cardStyle}>
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Attempted In Day
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {stats.attemptedInDay}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-calendar-day" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default DashboardHeader;
