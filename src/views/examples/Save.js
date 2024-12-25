import React, { useState, useEffect } from "react";
import { Card, CardHeader, Table, Container, Row, Button, Media, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";

const Save = () => {
  const [savedChapters, setSavedChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState(null);
  const [errorQuestions, setErrorQuestions] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Fetch saved chapters data
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = getCookie("token");

    if (!userId || !token) {
      setError('Session expired, please re-login');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/user/${userId}/chapters`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: userId,
            },
          }
        );

        if (response.data.success) {
          setSavedChapters(response.data.data);
        } else {
          setError('Failed to fetch saved chapters');
        }
      } catch (error) {
        setError('Failed to fetch saved chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // Fetch questions for selected chapter
  const handleViewQuestions = async (chapterId) => {
    setLoadingQuestions(true);
    setErrorQuestions(null);

    const userId = localStorage.getItem("userId");
    const token = getCookie("token");

    if (!userId || !token) {
      setErrorQuestions('Session expired, please re-login');
      setLoadingQuestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `${apiUrl}/cvijhuvb/66ed8f1aedec5b7fdb78b186/cibeiehubwd/${chapterId}/vbdhuvbu/cwdjibhubd`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );

      if (response.data.success) {
        setQuestions(response.data.data.questions);
        setSelectedChapterId(chapterId);
      } else {
        setErrorQuestions('Failed to load questions');
      }
    } catch (error) {
      setErrorQuestions('Failed to load questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Handle Back to Saved Chapters
  const handleBackToChapters = () => {
    setSelectedChapterId(null);
    setQuestions([]);
  };

  // Handle Remove Question
  const handleRemoveQuestion = async (chapterId, questionId) => {
    const userId = localStorage.getItem("userId");
    const token = getCookie("token");

    if (!userId || !token) {
      setErrorQuestions('Session expired, please re-login');
      return;
    }

    try {
      // Make the POST request to remove the question
      const response = await axios.post(
        `https://auth.thepilotprep.com/v2/jdbuhb/cebfyuch/with-auth-token/cwidbshyu/save-or-unsave?userId=${userId}&chapterId=${chapterId}&questionId=${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );

      if (response.data.success) {
        // If the question is successfully removed, update the state
        setQuestions(questions.filter((question) => question.questionId !== questionId));
      } else {
        setErrorQuestions('Failed to remove question');
      }
    } catch (error) {
      setErrorQuestions('Failed to remove question');
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
                <h3 className="mb-0">
                  {selectedChapterId ? `Saved Questions` : "Saved Chapters"}
                </h3>
              </CardHeader>

              {/* Display Saved Chapters Table */}
              {!selectedChapterId && (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Chapter Name</th>
                      <th scope="col">Questions Saved</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center mt-5">
                          <Spinner color="primary" />
                          <p>Loading saved chapters...</p>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="3" className="text-center mt-5 text-danger">
                          {error}
                        </td>
                      </tr>
                    ) : savedChapters && savedChapters.length > 0 ? (
                      savedChapters.map((chapter) => {
                        return (
                          <tr key={chapter.chapterId}>
                            <th scope="row">
                              <Media className="align-items-center">
                                <span className="mb-0 text-sm">{chapter.chapterName}</span>
                              </Media>
                            </th>
                            <td>{chapter.numberOfQuestionsSaved}</td>
                            <td className="text-right">
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={() => handleViewQuestions(chapter.chapterId)}
                              >
                                View Questions
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No saved chapters found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}

              {/* Display Questions Table for Selected Chapter */}
              {selectedChapterId && (
                <>
                  <Button
                    color="primary"
                    onClick={handleBackToChapters}
                    style={{
                      width: '100px',
                      marginBottom: '15px',
                      marginLeft: '25px',
                      fontSize: '14px',
                      padding: '5px 10px',
                    }}
                    className="btn-sm"
                  >
                    Back
                  </Button>

                  {/* Single Question per Line Layout */}
                  <div className="mt-4">
                    {loadingQuestions ? (
                      <div className="text-center mt-5">
                        <Spinner color="primary" />
                        <p>Loading questions...</p>
                      </div>
                    ) : errorQuestions ? (
                      <div className="text-center mt-5 text-danger">
                        {errorQuestions}
                      </div>
                    ) : (
                      questions.map((question, index) => (
                        <div className="card mb-4" key={question.questionId}>
                          <div className="card-header" style={{ marginTop: '-10px' }}>
                            <strong>No. {index + 1}</strong> - <strong>Question:</strong> {question.questionText}
                          </div>
                          <div className="card-body">
                            <h6><strong>Options:</strong></h6>
                            <ul>
                              {question.options.map(option => (
                                <li key={option.optionId}>{option.optionText}</li>
                              ))}
                            </ul>
                            <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                          </div>
                          <div className="card-footer text-center">
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleRemoveQuestion(selectedChapterId, question.questionId)}
                            >
                              Remove
                            </Button>
                          </div>
                          {/* Grey divider below the Remove button container */}
                          <div
                          style={{
                            backgroundColor: '#F5F5F7',  // Light grey color
                            height: '20px',               // Thin line for break (1px is ideal for a separator)
                            marginTop: '10px',           // Optional: space above the line
                            marginBottom: '0px'          // Remove extra space below the divider
                          }}
                        ></div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Save;
