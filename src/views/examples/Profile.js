import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [/* loading */, setLoading] = useState(true);
  const [/* error */, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Get the userId from localStorage
      const token = getCookie('token'); // Retrieve token from cookies
  
      if (!userId) {
        setError('User ID not found in localStorage.');
        setLoading(false);
        return;
      }
      
      if (!token) {
        setError('Session expired, please re-login.');
        alert('Session expired, please re-login.');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.post(
          `${apiUrl}/csjdbcuyhbe/cskjbcuhbcuwh/${userId}`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add Authorization header
              Id: userId,                       // Add userId in headers as Id
            },
          }
        );
  
        if (response.data.success) {
          setUserData(response.data.data); // Set the user data
        } else {
          setError('Error fetching user data.');
          alert('Error fetching user data.');
        }
      } catch (err) {
        setError('Error fetching user data.');
        alert('Session expired, please re-login.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [apiUrl]);
  

  const defaultValue = (value) => value || '';

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col xl="10">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4 pr-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.name)}
                            id="input-name"
                            placeholder="Name"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.email)}
                            id="input-email"
                            placeholder="Email"
                            type="email"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Phone Number
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.number)}
                            id="input-phone"
                            placeholder="Phone Number"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country-code"
                          >
                            Country Code
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.countryCode)}
                            id="input-country-code"
                            placeholder="Country Code"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-flight-experience"
                          >
                            Flight Experience
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.flightExperience)}
                            id="input-flight-experience"
                            placeholder="Flight Experience"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-rtr"
                          >
                            RTR Status
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(userData?.rtr)}
                            id="input-rtr"
                            placeholder="RTR Status"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Contact Information */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4 pr-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={defaultValue(`${userData?.city || ''}, ${userData?.country || ''}`)}
                            id="input-address"
                            placeholder="Address"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4 pr-lg-4">
                    <FormGroup>
                      <label>Flight School</label>
                      <Input
                        className="form-control-alternative"
                        value={defaultValue(userData?.flightSchool)}
                        placeholder="Flight School"
                        type="text"
                        readOnly
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Airline</label>
                      <Input
                        className="form-control-alternative"
                        value={defaultValue(userData?.airline)}
                        placeholder="Airline"
                        type="text"
                        readOnly
                      />
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
