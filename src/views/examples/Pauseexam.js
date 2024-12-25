import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  Progress,
  Table,
  Container,
  Row,
  Button,
  Media,
  Spinner,
} from 'reactstrap';
import Header from 'components/Headers/Header.js';

const Pauseexam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = getCookie('token');
  
    if (!userId || !token) {
      setError('Session expired please re-login');
      setLoading(false);
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/edjifnji/user/${userId}/eijhbci`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: userId,
            },
          }
        );
  
        if (response.data.success) {
          setExams(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching the exams:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [apiUrl]);

  const calculateCompletionPercentage = (answeredQuestionIds, pendingQuestionIds) => {
    const totalQuestions = answeredQuestionIds.length + pendingQuestionIds.length;
    if (totalQuestions === 0) return 0; // Prevent division by zero
    return ((answeredQuestionIds.length / totalQuestions) * 100).toFixed(2); // Round to two decimal places
  };

  const handleContinueExam = async (chapterName, chapterId, pausedExamId) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = getCookie('token');
      
      if (!userId || !token) {
        throw new Error('User not authenticated');
      }
  
      const response = await axios.post(
        `${apiUrl}/user/${userId}/chapter/${chapterId}/resume/${pausedExamId}`,
        {}, // Empty body for post request
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );
  
      if (response.data && response.data.data) {
        // Store the submitExamId in localStorage
        localStorage.setItem('submitExamId', response.data.data.id); 
  
        navigate(`/admin/chapter/${chapterName}/${chapterId}/resume/${pausedExamId}`, {
          state: { examData: response.data },
        });
      } else {
        setError('Failed to fetch exam details');
      }
    } catch (error) {
      console.error('Error continuing the exam:', error);
      setError('Failed to fetch exam details');
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Paused Exams</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Exams</th>
                    <th scope="col">Completion</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center mt-5">
                        <Spinner color="primary" />
                        <p>Loading exams...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center mt-5 text-danger">
                        {error}
                      </td>
                    </tr>
                  ) : exams && exams.length > 0 ? (
                    exams.map((exam) => {
                      const completionPercentage = calculateCompletionPercentage(
                        exam.answeredQuestionIds,
                        exam.pendingQuestionIds
                      );
                      return (
                        <tr key={exam.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {exam.chapterName}
                                </span>
                              </Media>
                            </Media>
                          </th>
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
                          <td className="text-right">
                            <Button
                              color="secondary"
                              size="sm"
                              onClick={() =>
                                handleContinueExam(
                                  exam.chapterName,
                                  exam.chapterId,
                                  exam.id
                                )
                              }
                            >
                              Continue Exam
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No exams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Pauseexam;
