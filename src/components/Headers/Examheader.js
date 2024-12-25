import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, Container, Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";

const Examheader = ({ questions, selectedOptions, visitedQuestions, navigateToQuestion }) => {
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalQuestions, setModalQuestions] = useState([]);

  const toggleModal = () => setModal(!modal);

  const handleBoxClick = (status) => {
    let title = '';
    let filteredQuestions = [];

    if (status === 'attempted') {
      title = 'Attempted Questions';
      filteredQuestions = questions.map((q, index) => ({ ...q, index })).filter((_, index) => selectedOptions[index] !== undefined);
    } else if (status === 'notVisited') {
      title = 'Not Visited Questions';
      filteredQuestions = questions.map((q, index) => ({ ...q, index })).filter((_, index) => !visitedQuestions.includes(index) && selectedOptions[index] === undefined);
    } else if (status === 'pending') {
      title = 'Pending Questions';
      filteredQuestions = questions.map((q, index) => ({ ...q, index })).filter((_, index) => visitedQuestions.includes(index) && selectedOptions[index] === undefined);
    }

    setModalTitle(title);
    setModalQuestions(filteredQuestions);
    toggleModal();
  };

  // Adjusted logic for notVisitedCount: only count unvisited questions that haven't been answered
  const notVisitedCount = questions.filter((_, index) => !visitedQuestions.includes(index) && selectedOptions[index] === undefined).length;
  const attemptedCount = questions.filter((_, index) => selectedOptions[index] !== undefined).length;
  const pendingCount = questions.filter((_, index) => visitedQuestions.includes(index) && selectedOptions[index] === undefined).length;

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col>
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <CardTitle
                    tag="h5"
                    className="text-uppercase text-muted mb-0"
                  >
                    Questions Overview
                  </CardTitle>
                  <div className="d-flex flex-wrap justify-content-around mt-4 mb-4">
                    <div className="d-flex flex-column flex-sm-row align-items-center mb-2 mb-sm-0">
                      <div
                        className="clickable-box"
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: 'lightgreen',
                          border: '1px solid #ccc',
                          textAlign: 'center',
                          lineHeight: '30px',
                          cursor: 'pointer',
                          borderRadius: '5px'
                        }}
                        onClick={() => handleBoxClick('attempted')}
                      >
                        {attemptedCount}
                      </div>
                      <span style={{ marginLeft: '10px', color: 'green' }}>Attempted</span>
                    </div>
                    <div className="d-flex flex-column flex-sm-row align-items-center mb-2 mb-sm-0">
                      <div
                        className="clickable-box"
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          textAlign: 'center',
                          lineHeight: '30px',
                          cursor: 'pointer',
                          borderRadius: '5px'
                        }}
                        onClick={() => handleBoxClick('notVisited')}
                      >
                        {notVisitedCount}
                      </div>
                      <span style={{ marginLeft: '10px', color: 'black' }}>Not Visited</span>
                    </div>
                    <div className="d-flex flex-column flex-sm-row align-items-center">
                      <div
                        className="clickable-box"
                        style={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: 'orange',
                          border: '1px solid #ccc',
                          textAlign: 'center',
                          lineHeight: '30px',
                          cursor: 'pointer',
                          borderRadius: '5px'
                        }}
                        onClick={() => handleBoxClick('pending')}
                      >
                        {pendingCount}
                      </div>
                      <span style={{ marginLeft: '10px', color: 'red' }}>Pending</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>{modalTitle}</ModalHeader>
        <ModalBody>
          {modalQuestions.length > 0 ? (
            <div className="d-flex flex-wrap">
              {modalQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="d-flex align-items-center mb-2 mr-2"
                  onClick={() => {
                    toggleModal();
                    navigateToQuestion(question.index);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="clickable-box"
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: selectedOptions[question.index] !== undefined ? 'lightgreen' : 'white',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      lineHeight: '30px',
                      borderRadius: '5px'
                    }}
                  >
                    {question.index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No questions to display.</p>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

Examheader.propTypes = {
  questions: PropTypes.array.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  visitedQuestions: PropTypes.array.isRequired,
  navigateToQuestion: PropTypes.func.isRequired,
};

Examheader.defaultProps = {
  questions: [],
  selectedOptions: {},
  visitedQuestions: [],
  navigateToQuestion: () => {},
};

export default Examheader;
