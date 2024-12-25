import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, Tooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, } from 'reactstrap';
import Header from 'components/Headers/Header';
import axios from 'axios';
import { FaRobot } from 'react-icons/fa'; // Import robot icon to indicate AI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faMinusCircle } from '@fortawesome/free-solid-svg-icons'; 

const PreviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examResult, setExamResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState([]); // For filtered questions based on dropdown selection
  const [selectedFilter, setSelectedFilter] = useState('all'); // Activated state for managing selected filter
  const [dropdownOpen, setDropdownOpen] = useState(false); // For handling dropdown state
  const [aiExplanation, setAiExplanation] = useState(''); // For storing AI explanation
  const [aiLoading, setAiLoading] = useState(false); // For showing loading state while fetching AI explanation
  const [aiError, setAiError] = useState(null); // To capture errors in AI call
  const [tooltipOpen, setTooltipOpen] = useState(false); // Tooltip state
  const [tooltipForSave, setTooltipForSave] = useState(false);
  const [/*errorQuestions*/, setErrorQuestions] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // For Jump to Question Modal
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);

  const toggleJumpModal = () => setIsJumpModalOpen(!isJumpModalOpen);

  const toggleTooltipForSave = () => setTooltipForSave(!tooltipForSave);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        const id = localStorage.getItem('id');
        const Id = localStorage.getItem('userId');
        const examId = localStorage.getItem('examId');
        const token = getCookie('token');

        if (!id || !examId || !token) {
          throw new Error('ID, Exam ID, or token not found in localStorage or cookies');
        }

        const response = await axios.post(
          `${apiUrl}/edjifnji/get-finished-exam/${id}/user/${examId}`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: Id,
            },
          }
        );

        if (response.data && response.data.data) {
          const questionsWithIndex = response.data.data.examResult.questionResults.map(
            (q, index) => ({
              ...q,
              originalIndex: index + 1, // Add original serial number
              saved: false, // Default value for saved
            })
          );
  
          // Merge saved values from examDetails into questionResults
          const questionsWithSaved = questionsWithIndex.map((q) => {
            const matchingQuestion = response.data.data.examDetails.examDetails.questionDetails.find(
              (qDetail) => qDetail.questionId === q.questionId
            );
            return {
              ...q,
              saved: matchingQuestion ? matchingQuestion.saved : false, // Merge saved value
            };
          });
  
          // Log saved values of each question
          console.log('Saved values of each question:');
          questionsWithSaved.forEach((q) => {
            console.log(`Question ${q.originalIndex} saved: ${q.saved}`);
          });
  
          setExamResult({
            ...response.data.data,
            examResult: {
              ...response.data.data.examResult,
              questionResults: questionsWithSaved, // Add indexed and merged questions
            },
          });
  
          setFilteredQuestions(questionsWithSaved); // Set initial filtered questions
        } else {
          console.error('Failed to load exam results');
        }
      } catch (error) {
        console.error('Error fetching exam result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [apiUrl]);


  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetAiExplanation(); // Reset AI explanation when switching questions
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetAiExplanation(); // Reset AI explanation when switching questions
    }
  };

  const resetAiExplanation = () => {
    setAiExplanation(''); // Clear AI explanation
    setAiError(null); // Clear any previous AI errors
  };

  const fetchAiExplanation = async (questionId) => {
    try {
      setAiLoading(true);
      setAiError(null); // Clear any previous errors
      const token = getCookie("token");
      const userId = localStorage.getItem("userId");
  
      if (!token || !userId) {
        setAiError("User not authenticated or token not found.");
        setAiLoading(false);
        return;
      }
  
      const response = await axios.post(
        `${apiUrl}/cschuuch/csijbyucs/${questionId}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
            Id: userId, // Id header with user ID
          },
        }
      );
  
      setTimeout(() => {
        if (response.data && response.data.data) {
          const rawExplanation = response.data.data.explanation;
  
          // Replace new line characters with actual spacing and separate blocks
          const formattedExplanation = rawExplanation
            .split("\n")
            .map((line) => line.trim()) // Trim spaces around each line
            .filter((line) => line) // Remove empty lines
            .join("\n\n"); // Add double spacing between lines for readability
  
          setAiExplanation(formattedExplanation);
        } else {
          setAiError("AI explanation not found.");
        }
        setAiLoading(false);
      }, 2000); // Reduced the delay to 2 seconds
    } catch (error) {
      setAiError("Failed to fetch AI explanation.");
      console.error("Error fetching AI explanation:", error);
      setAiLoading(false);
    }
  };

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter); // Update the selected filter state
    let filtered;
    if (filter === 'correct') {
        filtered = examResult.examResult.questionResults
            .filter((q) => q.correct === true)
            .map((q, index) => ({ ...q, originalIndex: examResult.examResult.questionResults.indexOf(q) + 1 }));
    } else if (filter === 'incorrect') {
        filtered = examResult.examResult.questionResults
            .filter((q) => q.correct === false)
            .map((q, index) => ({ ...q, originalIndex: examResult.examResult.questionResults.indexOf(q) + 1 }));
    } else {
        filtered = examResult.examResult.questionResults.map((q, index) => ({
            ...q,
            originalIndex: index + 1, // Keep original serial numbers
        }));
    }
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0); // Reset to the first question of the new filtered list
};


  const aiButtonStyles = {
    backgroundColor: 'transparent', // No background color, only the icon
    border: 'none',
    padding: '12px',
    display: 'inline-flex',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.3s ease-in-out',
    fontSize: '24px', // Initial icon size
  };

  const iconHover = {
    onMouseEnter: (e) => {
      e.target.style.transform = 'scale(1)'; // Make icon bigger when hovered
    },
    onMouseLeave: (e) => {
      e.target.style.transform = 'scale(0.8)'; // Revert to original size when not hovered
    },
    onClick: () => fetchAiExplanation(filteredQuestions[currentQuestionIndex].questionId),
    disabled: aiLoading, // Disable the button while loading
  };

  const handleSaveUnsaveQuestion = async (questionId, isSaved) => {
    const userId = localStorage.getItem("userId");
    const token = getCookie("token");
  
    if (!userId || !token) {
      setErrorQuestions('Session expired, please re-login');
      return;
    }
  
    try {
      // Call the API to save or unsave the question
      const response = await axios.post(
        `${apiUrl}/save-or-unsave?userId=${userId}&chapterId=${examResult.examDetails.chapterId}&questionId=${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );
  
      if (response.data.success) {
        // Update the saved state for the question
        setFilteredQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.questionId === questionId
              ? { ...question, saved: !isSaved } // Toggle saved state
              : question
          )
        );
      } else {
        // Show the error message from the API in an alert
        setErrorQuestions(response.data.data || "An error occurred while processing your request.");
      }
    } catch (error) {
      console.error('Error saving or unsaving question:', error);
      setErrorQuestions('Failed to save/unsave the question');
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    toggleJumpModal(); // Close the modal after selecting the question number
  };

  if (loading) {
    return (
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4">
            <Card className="shadow">
              <CardBody className="text-center">
                <p>Loading exam results...</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!examResult || !examResult.examResult) {
    return (
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4">
            <Card className="shadow">
              <CardBody className="text-center">
                <p>No exam result found.</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  const result = examResult.examResult;
  const questionResult = filteredQuestions[currentQuestionIndex];
  const questionDetail =
    questionResult &&
    examResult.examDetails.examDetails.questionDetails.find(
      (q) => q.questionId === questionResult.questionId
    );

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4">
            <Card className="shadow">
              <CardHeader className="d-flex flex-column justify-content-between align-items-start">
                {/* Removed text-truncate to allow full exam name on the second line */}
                <h3 className="mb-0">Exam Result : {result.examName}</h3>
                <div className="d-flex align-items-center">
                  {/* Dropdown for filtering questions */}
                  <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                    <DropdownToggle caret>
                      {selectedFilter === 'all' && 'All Questions'}
                      {selectedFilter === 'correct' && 'Correct Questions'}
                      {selectedFilter === 'incorrect' && 'Incorrect Questions'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleFilterChange('all')}>All Questions</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange('correct')}>Correct Questions</DropdownItem>
                      <DropdownItem onClick={() => handleFilterChange('incorrect')}>Incorrect Questions</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Button
                    color="secondary"
                    style={{ marginLeft: '10px', padding: '8px 16px' }}
                    onClick={toggleJumpModal}
                  >
                    Go To
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate('/admin/index')}
                    className="ml-2 mt-2 mt-md-0"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {filteredQuestions.length === 0 ? (
                  <div className="text-center">
                    <h5>No questions match the selected filter.</h5>
                    <Button
                      color="primary"
                      onClick={() => handleFilterChange('all')}
                      className="mt-3"
                    >
                      Reset Filter
                    </Button>
                  </div>
                ) : (
                  <>
                    <h4 className="mb-4">
                      Score: {result.correctAnswers} / {result.totalQuestions}
                    </h4>
                    <div className="mb-4">
                      <h5>Question {questionResult.originalIndex}:</h5>
                      <p>{questionDetail?.questionText || 'N/A'}</p>
                      {questionDetail?.questionImage && (
                        <div className="text-center mb-3">
                          <img
                            src={questionDetail.questionImage}
                            alt="Question visual"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-flex align-items-center">
                      {/* Save/Unsave Button */}
                      <Button
                        color="link"
                        size="sm"
                        id={`saveUnsaveTooltip-${questionResult?.questionId}`}
                        onClick={() => handleSaveUnsaveQuestion(questionResult?.questionId, questionResult?.saved)}
                        onMouseOver={toggleTooltipForSave}
                        onMouseOut={toggleTooltipForSave}
                        style={{ marginLeft: '10px' }}
                        className="ml-auto"
                      >
                        <FontAwesomeIcon
                          icon={questionResult?.saved ? faMinusCircle : faBookmark}
                          style={{
                            color: questionResult?.saved ? 'red' : 'gold',
                            fontSize: '22px',
                          }}
                        />
                      </Button>
                      <Tooltip
                        placement="top"
                        isOpen={tooltipForSave}
                        target={`saveUnsaveTooltip-${questionResult?.questionId}`}
                        toggle={toggleTooltipForSave}
                      >
                        {questionResult?.saved ? 'Unsave' : 'Save'} this question
                      </Tooltip>
                    </div>
                    {/* Options Section */}
                    <div className="mb-4">
                      <h5>Options:</h5>
                      <ul>
                        {questionDetail?.options.map((option) => (
                          <li key={option.optionId}>
                            {option.optionText}
                            {option.optionImage && (
                              <img
                                src={option.optionImage}
                                alt="Option visual"
                                style={{ maxWidth: '100px', height: 'auto', marginLeft: '10px' }}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  
                    <div className="mb-4">
                      <h5>Your Answer:</h5>
                      <p
                        style={{
                          color: questionResult.correct ? 'green' : 'red',
                        }}
                      >
                        {questionResult.userAnswer || 'No answer'}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h5>Correct Answer:</h5>
                      <p>{questionDetail?.correctAnswer || 'N/A'}</p>
                    </div>

                    {/* AI Explanation Button and Response */}
                    <div className="mb-4">
                      <Button id="ai-button" style={aiButtonStyles} {...iconHover}>
                        <FaRobot />
                      </Button>
                      <Tooltip
                        placement="top"
                        isOpen={tooltipOpen}
                        target="ai-button"
                        toggle={toggleTooltip}
                      >
                        Ask AI
                      </Tooltip>
                      {aiLoading && (
                        <div className="text-center mt-3">
                          <div className="spinner-grow text-info" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          <p className="mt-3">AI is processing...</p>
                        </div>
                      )}
                      {aiExplanation && (
                        <div className="mt-3">
                          <h5>AI Explanation:</h5>
                          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", textAlign: "justify" }}>
                            {aiExplanation
                              .split("\n\n") // Split into paragraphs
                              .map((paragraph, index) => (
                                <p key={index} style={{ marginBottom: "15px" }}>
                                  {paragraph}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}
                      {aiError && <p className="text-danger mt-3">{aiError}</p>}
                    </div>

                    {/* Previous and Next buttons */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        style={{
                          marginRight: '10px',
                          padding: '8px 16px',
                          width: '100px',
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        color="primary"
                        onClick={handleNext}
                        disabled={currentQuestionIndex === filteredQuestions.length - 1}
                        style={{ padding: '8px 16px', width: '100px' }}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Jump to Question Modal */}
      <Modal isOpen={isJumpModalOpen} toggle={toggleJumpModal}>
        <ModalHeader toggle={toggleJumpModal}>Jump to Question</ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {filteredQuestions.map((q, idx) => (
              <Button
                key={q.questionId}
                color="white"
                size="sm"
                style={{
                  margin: '5px',
                  border: '1px solid #ccc',
                  color: '#333',
                  backgroundColor: currentQuestionIndex === idx ? '#e9ecef' : 'white', // Highlight current question
                }}
                onClick={() => handleJumpToQuestion(idx)}
              >
                {q.originalIndex} {/* Use originalIndex instead of idx + 1 */}
              </Button>
            ))}
          </div>
        </ModalBody>
      </Modal>   
     </>
  );
};

export default PreviewPage;
