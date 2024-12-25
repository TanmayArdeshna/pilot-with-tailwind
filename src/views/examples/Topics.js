import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Container, Row, Col, Button, Table, Spinner, Media } from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Topics = () => {
  const [topicsData, setTopicsData] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Wrap fetchMainTopics with useCallback to ensure a stable reference
  const fetchMainTopics = useCallback(async () => {
    try {
      setLoading(true); // Show loader while fetching data
      const userId = localStorage.getItem("userId");
      const token = getCookie("token");

      if (!userId || !token) {
        throw new Error("User ID or Token not found.");
      }

      const response = await axios.post(
        `${apiUrl}/getAllMainTopics/deijdhu8e`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );

      const mainTopics = response.data.data;
      setTopicsData(mainTopics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load main topics");
    } finally {
      setLoading(false); // Hide loader after fetching
    }
  }, [apiUrl]);

  useEffect(() => {
    // Check for persisted data to restore chapters
    const savedSubTopic = JSON.parse(localStorage.getItem("selectedSubTopic"));
    const savedChapters = JSON.parse(localStorage.getItem("chapters"));

    if (savedSubTopic && savedChapters) {
      setSelectedSubTopic(savedSubTopic);
      setChapters(savedChapters);
    } else {
      fetchMainTopics(); // Fetch topics if no persisted data is found
    }
  }, [fetchMainTopics]);

  const handleSubTopicClick = async (subTopic) => {
    setSelectedSubTopic(subTopic);
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      const token = getCookie("token");

      if (!userId || !token) {
        throw new Error("User ID or Token not found.");
      }

      const response = await axios.post(
        `${apiUrl}/subTopics/veifbei/${subTopic.subtopicId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );

      const chaptersData = response.data.data;
      setChapters(chaptersData);

      // Persist data in localStorage
      localStorage.setItem("selectedSubTopic", JSON.stringify(subTopic));
      localStorage.setItem("chapters", JSON.stringify(chaptersData));
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setError("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (chapterName, chapterId) => {
    // Clear selected options before starting the exam
    localStorage.removeItem(`selectedOptions-${chapterId}`);

    // Navigate to TopicPage with the appropriate chapterName and chapterId
    navigate(`/admin/chapter/${chapterName}/${chapterId}`);
  };

  const handleBackToTopics = () => {
    // Clear persisted data
    localStorage.removeItem("selectedSubTopic");
    localStorage.removeItem("chapters");

    // Reset state and fetch main topics
    setSelectedSubTopic(null);
    setChapters([]);
    fetchMainTopics(); // Fetch the main topics again when going back
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {selectedSubTopic ? (
          <Row>
            <Col>
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">{selectedSubTopic.subTopicName}</h3>
                  <Button color="link" onClick={handleBackToTopics}>
                    Back to Topics
                  </Button>
                </CardHeader>
                {loading ? (
                  <div className="text-center mt-5">
                    <Spinner color="primary" />
                    <p>Loading chapters...</p>
                  </div>
                ) : error ? (
                  <div className="text-center mt-5">{error}</div>
                ) : (
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Chapters</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {chapters.map((chapter) => (
                        <tr key={chapter.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">{chapter.chapterName}</span>
                              </Media>
                            </Media>
                          </th>
                          <td className="text-right">
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={() => handleStartExam(chapter.chapterName, chapter.id)}
                            >
                              Start Exam
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {loading ? (
              <div className="text-center mt-5">
                <Spinner color="primary" />
                <p>Loading topics...</p>
              </div>
            ) : error ? (
              <div className="text-center mt-5">{error}</div>
            ) : (
              topicsData.map((topic, index) => (
                <Col lg="4" key={index} className="mb-4">
                  <Card className="shadow">
                    <CardHeader>
                      <h3 className="mb-0">{topic.mainTopicName}</h3>
                    </CardHeader>
                    <CardBody>
                      {topic.subtopics &&
                        topic.subtopics.map((subTopic, subIndex) => (
                          <Button
                            key={subIndex} color="link" onClick={() => handleSubTopicClick(subTopic)}>
                            {subTopic.subTopicName}
                          </Button>
                        ))}
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Topics;
