// import React, { useState, useEffect } from 'react';
// import {
//   // Badge,
//   Card,
//   CardHeader,
//   // Pagination,
//   // PaginationItem,
//   // PaginationLink,
//   // Progress,
//   Table,
//   Container,
//   Row,
//   Button,
//   Media,
// } from "reactstrap";
// import Header from "components/Headers/Header.js";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Finishedexams = () => {
//   const [finishedExams, setFinishedExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     const fetchFinishedExams = async () => {
//       try {
//         const userId = localStorage.getItem('userId');
//         if (!userId) {
//           setError("User ID not found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.post(`${apiUrl}/api/exam/dijd/edjifnji/user/finished-exam/${userId}/eijhbci`);
//         setFinishedExams(response.data.data);
//       } catch (error) {
//         console.error("Error fetching finished exams:", error);
//         setError("Failed to load finished exams");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFinishedExams();
//   }, [apiUrl]);

//   const handlePreviewClick = (exam) => {
//     const userId = localStorage.getItem('userId'); // Retrieve `userId` from localStorage
//     const examId = exam.examId; // Get `examId` from the passed exam object
//     localStorage.setItem('id', exam.id);
//     localStorage.setItem('examId', examId);
//     navigate(`/admin/preview/${userId}/${examId}`);
//   };

//   return (
//     <>
//       <Header />
//       <Container className="mt--7" fluid>
//         <Row>
//           <div className="col">
//             <Card className="shadow">
//               <CardHeader className="border-0">
//                 <h3 className="mb-0">Finished Exams</h3>
//               </CardHeader>
//               <Table className="align-items-center table-flush" responsive>
//                 <thead className="thead-light">
//                   <tr>
//                     <th scope="col">Exams</th>
//                     <th scope="col">Percentage</th>
//                     <th scope="col" />
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="4" className="text-center">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : error ? (
//                     <tr>
//                       <td colSpan="4" className="text-center text-danger">
//                         {error}
//                       </td>
//                     </tr>
//                   ) : finishedExams.length > 0 ? (
//                     finishedExams.map((exam) => (
//                       <tr key={exam.id}>
//                         <th scope="row">
//                           <Media className="align-items-center">
//                             <Media>
//                               <span className="mb-0 text-sm">
//                                 {exam.examName}
//                               </span>
//                             </Media>
//                           </Media>
//                         </th>
//                         <td>
//                           {((exam.correctAnswers / exam.totalQuestions) * 100).toFixed(2)}%
//                         </td>
//                         <td className="text-right">
//                           <Button
//                             color="secondary"
//                             size="sm"
//                             onClick={() => handlePreviewClick(exam)}
//                           >
//                             Preview Exam
//                           </Button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4" className="text-center">
//                         No finished exams found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </Card>
//           </div>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Finishedexams;
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Button,
  Media,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinishedExams = () => {
  const [finishedExams, setFinishedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainTopics, setMainTopics] = useState([]); // For main topics
  const [subTopics, setSubTopics] = useState([]); // For subtopics
  const [selectedMainTopic, setSelectedMainTopic] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [filteredExams, setFilteredExams] = useState([]); // Exams filtered based on user selection
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = getCookie('token');
  
        if (!userId || !token) {
          setError("Session expired please re-login");
          setLoading(false);
          return;
        }
  
        // Fetch finished exams
        const examsResponse = await axios.post(
          `${apiUrl}/edjifnji/user/finished-exam/${userId}/eijhbci`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: userId,
            },
          }
        );
        setFinishedExams(examsResponse.data.data);
  
        // Fetch main topics and subtopics
        const topicResponse = await axios.get(
          `${apiUrl}/average-percentage?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Id: userId,
            },
          }
        );
        setMainTopics(topicResponse.data.data.mainTopics);
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInitialData();
  }, [apiUrl]);
  

  // Handle main topic selection
  const handleMainTopicChange = (e) => {
    const selectedMainTopicId = e.target.value;
    setSelectedMainTopic(selectedMainTopicId);

    // Find the corresponding subtopics for the selected main topic
    const selectedMainTopic = mainTopics.find(topic => topic.mainTopicId === selectedMainTopicId);
    setSubTopics(selectedMainTopic ? selectedMainTopic.subTopics : []);
    setSelectedSubTopic(""); // Reset subtopic when main topic changes
  };

  // Handle subtopic selection
  const handleSubTopicChange = (e) => {
    setSelectedSubTopic(e.target.value);
  };

  // Fetch filtered exams based on mainTopic and subTopic
  useEffect(() => {
    const fetchFilteredExams = async () => {
      if (selectedMainTopic && selectedSubTopic) {
        setLoading(true);
        try {
          const userId = localStorage.getItem('userId');
          const token = getCookie('token');
  
          if (!userId || !token) {
            setError("User ID or token not found");
            setLoading(false);
            return;
          }
  
          // Fetch the filtered exams based on main topic and subtopic
          const response = await axios.get(
            `${apiUrl}/average-percentage?userId=${userId}&mainTopicId=${selectedMainTopic}&subTopicId=${selectedSubTopic}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Id: userId,
              },
            }
          );
          
          const filteredChapterIds = response.data.data.chapters.map((chapter) => chapter.chapterId);
  
          // Filter exams by checking if their chapterId is in the filteredChapterIds
          const filtered = finishedExams.filter((exam) =>
            filteredChapterIds.includes(exam.chapterId)
          );
          setFilteredExams(filtered);
        } catch (error) {
          console.error("Error fetching filtered exams:", error);
          setError("Failed to load filtered exams");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset filtered exams when no filters are applied
        setFilteredExams([]);
      }
    };
  
    fetchFilteredExams();
  }, [selectedMainTopic, selectedSubTopic, finishedExams, apiUrl]);
  

  const handlePreviewClick = (exam) => {
    const userId = localStorage.getItem('userId');
    const examId = exam.examId;
    localStorage.setItem('id', exam.id);
    localStorage.setItem('examId', examId);
    navigate(`/admin/preview/${userId}/${examId}`);
  };

  // Determine which list to display: filtered or all exams
  const examsToDisplay = filteredExams.length > 0 ? filteredExams : finishedExams;

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Finished Exams</h3>
              </CardHeader>

              {/* Filters */}
              <Row className="p-3">
                <FormGroup className="col-md-4">
                  <Label for="mainTopic">Main Topic</Label>
                  <Input
                    type="select"
                    id="mainTopic"
                    value={selectedMainTopic}
                    onChange={handleMainTopicChange}
                  >
                    <option value="">Select Main Topic</option>
                    {mainTopics.map((topic) => (
                      <option key={topic.mainTopicId} value={topic.mainTopicId}>
                        {topic.mainTopicName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <FormGroup className="col-md-4">
                  <Label for="subTopic">Subtopic</Label>
                  <Input
                    type="select"
                    id="subTopic"
                    value={selectedSubTopic}
                    onChange={handleSubTopicChange}
                    disabled={!selectedMainTopic}
                  >
                    <option value="">Select Subtopic</option>
                    {subTopics.map((subTopic) => (
                      <option key={subTopic.subTopicId} value={subTopic.subTopicId}>
                        {subTopic.subTopicName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Row>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Exams</th>
                    <th scope="col">Percentage</th>
                    <th scope="col">Finished Date</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="4" className="text-center text-danger">
                        {error}
                      </td>
                    </tr>
                  ) : examsToDisplay.length > 0 ? (
                    examsToDisplay.map((exam) => (
                      <tr key={exam.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {exam.examName}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>
                          {((exam.correctAnswers / exam.totalQuestions) * 100).toFixed(2)}%
                        </td>
                        <td>
                          {new Date(exam.createdOn).toLocaleString()} {/* Formats the date and time */}
                        </td>
                        <td className="text-right">
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() => handlePreviewClick(exam)}
                          >
                            Preview Exam
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No finished exams found.
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

export default FinishedExams;
