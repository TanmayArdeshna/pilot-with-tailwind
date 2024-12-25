import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Alert,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from 'reactstrap';
import Examheader from 'components/Headers/Examheader';
import Header from 'components/Headers/Header';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faBookmark, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const TopicPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [/* alertForNavigation */, setAlertForNavigation] = useState(false);
  const [hasActivity, setHasActivity] = useState(false);
  const [saving, setSaving] = useState(false);
  const [examId, setExamId] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [chapterName, setChapterName] = useState(null);
  const [ /* subTopicName */, setSubTopicName] = useState('');
  const [reportModal, setReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipForSave, setTooltipForSave] = useState(false);
  const [/* errorQuestions */, setErrorQuestions] = useState(null); 
  const apiUrl = process.env.REACT_APP_API_URL;

  // Check if there are unsaved changes
  const hasUnsavedChanges = Object.keys(selectedOptions).length > 0;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        
        // Retrieve userId and token
        const userId = localStorage.getItem("userId");
        const token = getCookie('token');
        
        if (!userId || !token) {
          console.error("User ID or Token not found.");
          return;
        }
  
        // Fetch exam details
        const response = await axios.post(
          `${apiUrl}/getExamDetails/fefjnej/${chapterId}`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: userId,
            },
          }
        );
  
        const examData = response.data.data[0];
        setSubTopicName(examData?.subTopicName || '');
        setChapterName(examData?.chapterName || '');
        setQuestions(examData?.examDetails?.questionDetails || []);
        setExamId(examData?.id);
  
        const storedSelectedOptions = JSON.parse(localStorage.getItem(`selectedOptions-${chapterId}`)) || {};
        setSelectedOptions(storedSelectedOptions);
        setVisitedQuestions(Object.keys(storedSelectedOptions).map((key) => parseInt(key)));
  
        setHasActivity(true); // Mark activity as soon as the page loads
      } catch (error) {
        console.error('Error fetching exam details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExamDetails();
  }, [chapterId, apiUrl]);  

  // Save selected options to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      `selectedOptions-${chapterId}`,
      JSON.stringify(selectedOptions)
    );
  }, [selectedOptions, chapterId]);

  // Handle option selection
  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: optionIndex,
    }));
    setVisitedQuestions((prevVisited) =>
      Array.from(new Set([...prevVisited, questionIndex]))
    );
  };

  // Handle clearing of selected option for a question 
  const handleClearSelection = (questionIndex) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = { ...prevSelectedOptions };
      delete updatedOptions[questionIndex];
      return updatedOptions;
    });
  };

  // Navigate to the next question
  const handleNextQuestion = () => {
    // Mark the current question as visited and pending if not answered
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setVisitedQuestions((prevVisited) =>
        Array.from(new Set([...prevVisited, currentQuestionIndex]))
      );
    }

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to the previous question
  const handlePreviousQuestion = () => {
    // Mark the current question as visited and pending if not answered
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setVisitedQuestions((prevVisited) =>
        Array.from(new Set([...prevVisited, currentQuestionIndex]))
      );
    }

    // Move to the previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle Save & Exit functionality
  const handleSaveAndExit = async () => {
    try {
      setSaving(true);
      const userId = localStorage.getItem("userId");
      const token = getCookie("token");

      if (!userId || !token) {
        console.error("User ID or Token not found.");
        return;
      }

      const answeredQuestionIds = Object.keys(selectedOptions).map((key) =>
        parseInt(key)
      );
      const pendingQuestionIds = questions
        .map((_, index) => index)
        .filter((index) => !answeredQuestionIds.includes(index));
      const questionStatuses = questions.map((question, index) => ({
        questionId: question.questionId,
        selectedAnswer:
          selectedOptions[index] !== undefined
            ? question.options[selectedOptions[index]].optionText
            : "",
      }));
  
      const payload = {
        userId,
        examId,
        chapterId,
        chapterName: chapterName || 'Unknown Chapter',
        answeredQuestionIds,
        pendingQuestionIds,
        questionStatuses,
      };

      await axios.post(`${apiUrl}/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Id: userId,
        },
      });

      setSelectedOptions({});
      setAlertForNavigation(false);
      localStorage.removeItem(`selectedOptions-${chapterId}`);
      navigate("/admin/topics");
    } catch (error) {
      console.error("Error saving exam:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = getCookie("token");
  
      if (!userId || !token) {
        console.error("User ID or Token not found.");
        return false;
      }
  
      const answeredQuestionIds = Object.keys(selectedOptions).map((key) => parseInt(key));
      const pendingQuestionIds = questions
        .map((_, index) => index)
        .filter((index) => !answeredQuestionIds.includes(index));
      const questionStatuses = questions.map((question, index) => ({
        questionId: question.questionId,
        selectedAnswer: selectedOptions[index] !== undefined
          ? question.options[selectedOptions[index]].optionText
          : "",
      }));
  
      const payload = {
        userId,
        examId,
        chapterId,
        chapterName: chapterName || 'Unknown Chapter',
        answeredQuestionIds,
        pendingQuestionIds,
        questionStatuses,
      };
  
      await axios.post(`${apiUrl}/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Id: userId,
        },
      });
  
      setSelectedOptions({});
      setAlertForNavigation(false);
      localStorage.removeItem(`selectedOptions-${chapterId}`);
      
      // Navigate to the "/admin/topics" path after successful save
      navigate('/admin/topics');
      return true;
    } catch (error) {
      console.error("Error saving exam:", error);
      return false;
    }
  };
  
  // Modified useBlocker implementation
  useBlocker(
    (tx) => {
      if (saving) return false;
      if (hasActivity) {
        const userConfirmed = window.confirm(
          "You have unsaved progress. Are you sure you want to leave? Your progress will be automatically saved."
        );
        
        if (userConfirmed) {
          setSaving(true);
          // Always navigate to '/admin/topics' after auto-save
          handleAutoSave().finally(() => {
            setSaving(false);
          });
        }
        return !userConfirmed;
      }
      return false;
    },
    [hasActivity, saving]
  );
  
  // Keep the original beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved progress. Are you sure you want to leave? Your progress will be automatically saved.';
        return e.returnValue;
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle Submit functionality
  const handleSubmit = () => {
    const allAnswered = questions.every(
      (_, index) => selectedOptions[index] !== undefined
    );

    if (!allAnswered) {
      setAlertVisible(true); // Show alert if not all questions are answered
    } else {
      setSaving(true); // Mark as saving to bypass blockers
      submitExam(); // Submit exam if all questions are answered
    }
  };

  // Submit exam answers to the API
  const submitExam = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = getCookie('token');
      
      if (!userId || !token) {
        console.error("User ID or Token not found.");
        return;
      }
  
      const answers = questions.map((question, index) => ({
        questionId: question.questionId,
        selectedAnswer:
          selectedOptions[index] !== undefined
            ? question.options[selectedOptions[index]].optionText
            : '',
      }));
  
      const payload = {
        userId,
        examId,
        answers,
      };
  
      const response = await axios.post(`${apiUrl}/submit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Id: userId,
        },
      });

      // Save exam results and cleanup
      setExamResult(response.data.data);
      const newExamId = response.data.data.examResult.id;
      localStorage.setItem('id', newExamId);
      localStorage.setItem('examId', examId);
      localStorage.removeItem(`selectedOptions-${chapterId}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setSaving(false); // Reset saving state after submission
    }
  };

  // Handle "Continue Anyway" in alert
  const continueAnyway = () => {
    setAlertVisible(false); // Close the alert
    setSaving(true); // Mark as saving to bypass blockers
    submitExam(); // Proceed with submission
  };

  // Toggle report modal
  const toggleReportModal = () => {
    setReportModal(!reportModal);
  };

  // Handle option selection for reporting
  const handleReportTopicChange = (e) => {
    setReportTopic(e.target.value);
  };

  // Submit report
  const handleReportSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = getCookie('token');
  
      if (!userId || !reportTopic || !token) {
        alert('Please select a reason to report.');
        return;
      }
  
      const currentQuestion = questions[currentQuestionIndex];
      const payload = {
        userId,
        questionId: currentQuestion.questionId,
        reportTopic,
      };
  
      await axios.post(
        `${apiUrl}/report-question/cjhdfue/cknefvuhs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );
  
      alert('Report submitted successfully.');
      toggleReportModal();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  // Navigate to a specific question (used when jumping directly to a question)
  const navigateToQuestion = (index) => {
    // Mark the current question as visited and pending if not answered
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setVisitedQuestions((prevVisited) =>
        Array.from(new Set([...prevVisited, currentQuestionIndex]))
      );
    }

    // Now navigate to the selected question
    setCurrentQuestionIndex(index);
  };

  // Determine which header to display based on the presence of examResult
  const HeaderComponent = examResult ? Header : Examheader;

  // Render only the exam score if examResult is available
  if (examResult) {
    const { examResult: result } = examResult;
    const userId = localStorage.getItem('userId');

    return (
      <>
        <HeaderComponent />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-4">
              <Card className="shadow">
                <CardBody className="text-center">
                  <h3>Exam Result: {result.examName}</h3>
                  <h4>
                    Score: {result.correctAnswers} / {result.totalQuestions}
                  </h4>
                  <div>
                    <Button
                      color="primary"
                      onClick={() => {
                        setSaving(true); // Temporarily disable blocker
                        setTimeout(() => {
                          navigate(`/admin/preview/${userId}/${examId}`); // Navigate after a short delay
                        }, 1000); // 1-second delay
                      }}
                      style={{ marginRight: '10px' }}
                    >
                      Preview Exam
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => {
                        setSaving(true); // Temporarily disable blocker
                        setTimeout(() => {
                          navigate('/admin/index', { replace: true }); // Navigate after 1 second
                        }, 1000); // 1-second delay
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Toggle tooltip
  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const toggleTooltipForSave = () => setTooltipForSave(!tooltipForSave);

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
        `${apiUrl}/save-or-unsave?userId=${userId}&chapterId=${chapterId}&questionId=${questionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );
  
      if (response.data.success) {
        // Check if the data is one of the success responses
        if (response.data.data === "Question saved successfully." || response.data.data === "Question removed successfully.") {
          // Update the saved state for the question
          setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
              question.questionId === questionId
                ? { ...question, saved: !isSaved } // Toggle saved state
                : question
            )
          );
        } else {
          // Show the error message from the API in an alert
          alert(response.data.data || "An error occurred while processing your request.");
        }
      } else {
        // If success is false, show a generic error message
        setErrorQuestions('Failed to save/unsave the question');
      }
    } catch (error) {
      console.error('Error saving or unsaving question:', error);
      setErrorQuestions('Failed to save/unsave the question');
    }
  };
  
  // Render exam questions
  return (
    <>
      <HeaderComponent
        questions={questions}
        selectedOptions={selectedOptions}
        visitedQuestions={visitedQuestions}
        navigateToQuestion={navigateToQuestion}
      />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4">
            <Card className="shadow">
              <CardHeader className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <h3 className="mb-3 mb-md-0">
                  {chapterName ? chapterName : 'Exam'}
                </h3>
                <div className="d-flex flex-row justify-content-start align-items-center flex-wrap">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleSubmit}
                    className="mr-2 mb-2"
                  >
                    Submit
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={handleSaveAndExit}
                    className="mr-2 mb-2"
                  >
                    Save & Exit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleClearSelection(currentQuestionIndex)}
                    className="mr-2 mb-2"
                  >
                    Clear
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    id="reportTooltip"
                    onClick={toggleReportModal}
                    className="mb-2"
                  >
                    <FontAwesomeIcon icon={faFlag} />
                  </Button>
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen}
                    target="reportTooltip"
                    toggle={toggleTooltip}
                  >
                    Report Question
                  </Tooltip>
                </div>
              </CardHeader>
              <CardBody>
                {alertVisible && (
                  <Alert color="warning" toggle={() => setAlertVisible(false)}>
                    <h4 className="alert-heading">Incomplete Exam!</h4>
                    <p>
                      You have not answered all the questions. Submitting now
                      may affect your overall score.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button color="danger" onClick={continueAnyway}>
                        Continue Anyway
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => setAlertVisible(false)}
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Alert>
                )}
                {/* Display the current question */}
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Loading questions...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <>
                    {/* Show only the current question */}
                    <h5>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h5>

                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Question text */}
                      <span>{questions[currentQuestionIndex]?.questionText}</span> {/* Display the current question */}

                      {/* Display the question image if it exists */}
                      {questions[currentQuestionIndex]?.questionImage && (
                        <div className="text-center mb-3">
                          <img
                            src={questions[currentQuestionIndex]?.questionImage}
                            alt="Question visual"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      )}

                      {/* Save/Unsave icon with Tooltip */}
                      <Button
                        color="link"
                        size="sm"
                        id={`saveUnsaveTooltip-${questions[currentQuestionIndex]?.questionId}`} // Unique ID for each question
                        onClick={() => handleSaveUnsaveQuestion(questions[currentQuestionIndex]?.questionId, questions[currentQuestionIndex]?.saved)}
                        onMouseOver={toggleTooltipForSave} // Show tooltip on mouse hover
                        onMouseOut={toggleTooltipForSave} // Hide tooltip when mouse is out
                        style={{ marginLeft: '10px' }}
                      >
                        {/* Show the appropriate icon based on the "saved" state */}
                        <FontAwesomeIcon
                          icon={questions[currentQuestionIndex]?.saved ? faMinusCircle : faBookmark} // Reverse the icons
                          style={{
                            color: questions[currentQuestionIndex]?.saved ? 'red' : 'gold', // Red for unsaved, gold for saved
                            fontSize: '22px',
                          }}
                        />
                      </Button>

                      {/* Tooltip for Save/Unsave */}
                      <Tooltip
                        placement="top"
                        isOpen={tooltipForSave} // Tooltip visibility based on the state
                        target={`saveUnsaveTooltip-${questions[currentQuestionIndex]?.questionId}`} // Unique ID for the target
                        toggle={toggleTooltipForSave} // Toggle the visibility
                      >
                        {questions[currentQuestionIndex]?.saved ? 'Unsave Question' : 'Save Question'} {/* Reverse tooltip text */}
                      </Tooltip>
                    </div>

                      {/* Report Modal */}
                      <Modal isOpen={reportModal} toggle={toggleReportModal}>
                        <ModalHeader toggle={toggleReportModal}>
                        Report Question
                      </ModalHeader>
                      <ModalBody>
                        <FormGroup tag="fieldset">
                          <legend>Why do you want to report this question?</legend>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="reportOptions"
                                value="Incorrect question"
                                checked={reportTopic === 'Incorrect question'}
                                onChange={handleReportTopicChange}
                              />
                              Incorrect question
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="reportOptions"
                                value="Incorrect options"
                                checked={reportTopic === 'Incorrect options'}
                                onChange={handleReportTopicChange}
                              />
                              Incorrect options
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="reportOptions"
                                value="Incorrect options"
                                checked={reportTopic === 'Incorrect options'}
                                onChange={handleReportTopicChange}
                              />
                              question explanation is not correct
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="reportOptions"
                                value="Other"
                                checked={reportTopic === 'Other'}
                                onChange={handleReportTopicChange}
                              />
                              Other
                            </Label>
                          </FormGroup>
                        </FormGroup>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={handleReportSubmit}>
                          Submit Report
                        </Button>
                        <Button color="secondary" onClick={toggleReportModal}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/* Options */}
                    <FormGroup tag="fieldset" style={{ marginBottom: '10px' }}>
                      {questions[currentQuestionIndex].options.map(
                        (option, optionIndex) => (
                          <FormGroup check key={option.optionId} style={{ marginBottom: '5px' }}>
                            <Label check>
                              <Input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                checked={
                                  selectedOptions[currentQuestionIndex] ===
                                  optionIndex
                                }
                                onChange={() =>
                                  handleOptionChange(
                                    currentQuestionIndex,
                                    optionIndex
                                  )
                                }
                              />
                              {option.optionText}
                            </Label>
                          </FormGroup>
                        )
                      )}
                    </FormGroup>

                    {/* Flex container for buttons */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={handlePreviousQuestion}
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
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        style={{ padding: '8px 16px', width: '100px' }}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No questions available for this chapter.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TopicPage;
