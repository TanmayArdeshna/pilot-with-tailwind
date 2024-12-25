import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, useBlocker } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';
import Examheader from 'components/Headers/Examheader';
import Header from 'components/Headers/Header';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faBookmark, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const ContinuePage = () => {
  const { chapterId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [examId, setExamId] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [saving, setSaving] = useState(false); // Track saving state
  const [/* alertForNavigation */, setAlertForNavigation] = useState(false); // Handle navigation alert
  const [tooltipForSave, setTooltipForSave] = useState(false);
  const [/* errorQuestions */, setErrorQuestions] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Check if there are unsaved changes
  const hasUnsavedChanges = Object.keys(selectedOptions).length > 0;

  useEffect(() => {
    const storedSelectedOptions = JSON.parse(localStorage.getItem(`selectedOptions-${chapterId}`)) || {};
    setSelectedOptions(storedSelectedOptions);

    const examDataFromState = location.state?.examData?.data;

    if (examDataFromState && Array.isArray(examDataFromState.questionStatuses)) {
      setQuestions(examDataFromState.questionStatuses);
      setExamId(examDataFromState.examId);

      const initialSelectedOptions = {};
      examDataFromState.questionStatuses.forEach((question, index) => {
        const selectedOptionIndex = question.options.findIndex(
          option => option.optionText === question.selectedAnswer
        );
        if (selectedOptionIndex !== -1) {
          initialSelectedOptions[index] = selectedOptionIndex;
        }
      });
      setSelectedOptions(initialSelectedOptions);
    } else {
      console.error("No exam data found for continuation");
    }
    setLoading(false);
  }, [chapterId, location.state]);

  useEffect(() => {
    localStorage.setItem(`selectedOptions-${chapterId}`, JSON.stringify(selectedOptions));
  }, [selectedOptions, chapterId]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
    setVisitedQuestions((prevVisited) =>
      Array.from(new Set([...prevVisited, questionIndex]))
    );
  };

  const handleClearSelection = (questionIndex) => {
    const updatedOptions = { ...selectedOptions };
    delete updatedOptions[questionIndex];
    setSelectedOptions(updatedOptions);
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setVisitedQuestions((prevVisited) =>
        Array.from(new Set([...prevVisited, currentQuestionIndex]))
      );
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (selectedOptions[currentQuestionIndex] === undefined) {
      setVisitedQuestions((prevVisited) =>
        Array.from(new Set([...prevVisited, currentQuestionIndex]))
      );
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSaveAndExit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const submitExamId = localStorage.getItem('submitExamId'); // Retrieve the submitExamId from localStorage
      const token = getCookie('token'); // Retrieve token from cookies
  
      if (!userId || !token) {
        throw new Error('User not authenticated');
      }
  
      const answeredQuestionIds = Object.keys(selectedOptions).map((key) => parseInt(key, 10) + 1);
      const pendingQuestionIds = questions
        .map((_, index) => index + 1)
        .filter((index) => !answeredQuestionIds.includes(index));
  
      const questionStatuses = questions.map((question, index) => ({
        questionId: question.questionId,
        selectedAnswer: selectedOptions[index] !== undefined ? question.options[selectedOptions[index]].optionText : '',
      }));
  
      const payload = {
        id: submitExamId, // Use the retrieved submitExamId as id in the payload
        userId,
        examId,
        chapterId,
        chapterName: questions[0]?.chapterName || 'Unknown Chapter',
        answeredQuestionIds,
        pendingQuestionIds,
        questionStatuses,
      };
  
      // Temporarily disable blockers before making the API call
      setSaving(true);
  
      // Make the API request with authentication headers
      await axios.post(`${apiUrl}/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Id: userId,
        },
      });
      setSelectedOptions({}); // Clear selected options
      setAlertForNavigation(false); // Reset navigation alert
  
      // Add a delay to avoid navigation alert and ensure state consistency
      setTimeout(() => {
        localStorage.removeItem(`selectedOptions-${chapterId}`); // Clear local storage
        navigate('/admin/pauseexams'); // Navigate after delay
      }, 1000); // 1 second delay
    } catch (error) {
      console.error('Error saving exam:', error);
    } finally {
      setSaving(false); // Re-enable blockers after API call and navigation
    }
  };

  // Navigation blocker
  useBlocker(
    () => {
      if (saving) return false; // Disable blocker if saving
      if (hasUnsavedChanges) {
        setAlertForNavigation(true); // Trigger alert
        return !window.confirm(
          "You have unsaved progress. Are you sure you want to leave? All your progress will be lost."
        );
      }
      return false;
    },
    [hasUnsavedChanges, saving]
  );

  // Add window beforeunload event handler
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved progress. Are you sure you want to leave? All your progress will be lost.';
        return e.returnValue;
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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

  const submitExam = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const submitExamId = localStorage.getItem('submitExamId'); // Retrieve submitExamId
      const token = getCookie('token'); // Retrieve token from cookies
  
      if (!userId || !submitExamId || !token) {
        console.error('Required data not found in localStorage or user is not authenticated');
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
        pausedExamId: submitExamId, // Use the stored id in the payload
        userId,
        examId,
        answers,
      };
  
      // Send the POST request with headers containing token and userId
      const response = await axios.post(
        `${apiUrl}/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Id: userId,
          },
        }
      );
  
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

  const currentQuestion = questions[currentQuestionIndex];

  const HeaderComponent = examResult ? Header : Examheader;

  if (examResult) {
    const { examResult: result } = examResult;

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
                          navigate(`/admin/preview/${result.userId}/${examId}`); // Navigate after a short delay
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

  return (
    <>
      <HeaderComponent
        questions={questions}
        selectedOptions={selectedOptions}
        visitedQuestions={visitedQuestions}
        navigateToQuestion={(index) => setCurrentQuestionIndex(index)}
      />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-4">
            <Card className="shadow">
              <CardHeader className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <h3 className="mb-0">Continue Exam</h3>
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
                {loading ? (
                  <div className="text-center">
                    <Spinner color="primary" />
                    <p>Loading questions...</p>
                  </div>
                ) : currentQuestion && currentQuestion.options ? (  // Check if currentQuestion and options exist
                  <div className="mb-4">
                    <h5>{`${currentQuestionIndex + 1}. ${currentQuestion.questionText}`}</h5>

                    {/* Display the question image if it exists */}
                    {currentQuestion.questionImage && (
                      <div className="text-center mb-3">
                        <img
                          src={currentQuestion.questionImage}
                          alt="Question visual"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </div>
                    )}

                    {/* Save/Unsave icon with Tooltip */}
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button
                        color="link"
                        size="sm"
                        id={`saveUnsaveTooltip-${currentQuestion.questionId}`} // Unique ID for each question
                        onClick={() => handleSaveUnsaveQuestion(currentQuestion.questionId, currentQuestion.saved)}
                        onMouseOver={toggleTooltipForSave} // Show tooltip on mouse hover
                        onMouseOut={toggleTooltipForSave} // Hide tooltip when mouse is out
                        style={{ marginLeft: '10px' }}
                      >
                        {/* Show the appropriate icon based on the "saved" state */}
                        <FontAwesomeIcon
                          icon={currentQuestion.saved ? faMinusCircle : faBookmark} // Reverse the icons
                          style={{
                            color: currentQuestion.saved ? 'red' : 'gold', // Red for unsaved, gold for saved
                            fontSize: '22px',
                          }}
                        />
                      </Button>

                      {/* Tooltip for Save/Unsave */}
                      <Tooltip
                        placement="top"
                        isOpen={tooltipForSave} // Tooltip visibility based on the state
                        target={`saveUnsaveTooltip-${currentQuestion.questionId}`} // Unique ID for the target
                        toggle={toggleTooltipForSave} // Toggle the visibility
                      >
                        {currentQuestion.saved ? 'Unsave Question' : 'Save Question'} {/* Reverse tooltip text */}
                      </Tooltip>
                    </div>

                    {/* Question Options */}
                    {currentQuestion.options.map((option, optionIndex) => (
                      <FormGroup check key={optionIndex}>
                        <Label check>
                          <Input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            checked={selectedOptions[currentQuestionIndex] === optionIndex}
                            onChange={() => handleOptionChange(currentQuestionIndex, optionIndex)}
                          />
                          {option.optionText}
                        </Label>
                      </FormGroup>
                    ))}
                  </div>
                ) : (
                  <p>No questions available for this chapter.</p>
                )}

                {/* Report Modal */}
                <Modal isOpen={reportModal} toggle={toggleReportModal}>
                  <ModalHeader toggle={toggleReportModal}>Report Question</ModalHeader>
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
                          Question explanation is not correct
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

                {/* Navigation buttons */}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContinuePage;
