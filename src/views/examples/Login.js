import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert
} from "reactstrap";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  // const apiUrl = process.env.REACT_APP_API_URL;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    setError(''); // Clear previous error message
    try {
      const response = await axios.post(`https://auth.thepilotprep.com/api/auth/user/login/dljcnji/cekbjid`, {
        email: email,
        password: password,
      });
      
      if (response.status === 200 && response.data.success) {
        const { id, token } = response.data.data;
  
        // Store userId in localStorage
        localStorage.setItem('userId', id);
  
        // Set token in cookies with a 24-hour expiration
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 144 * 60 * 60 * 1000); // 144 hours in milliseconds
        document.cookie = `token=${token}; path=/; secure; expires=${expirationDate.toUTCString()}`;
  
        // Navigate to the desired page after successful login
        navigate('/admin/index');
      } else {
        setError(response.data.error || 'Invalid email or password.');
        console.error('Login failed', response.data);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); 
      } else {
        setError('An error occurred during login.');
      }
      console.error('An error occurred during login', error);
    }
  };   

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3a7bd5 0%, #3a6073 100%)'
    }}>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            {error && <Alert color="danger">{error}</Alert>} {/* Display error message */}
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"} // Change type based on state
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText style={{ cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />} {/* Toggle between eye icons */}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {/* <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor="customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div> */}
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={handleSignIn}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/register'); // Navigate to the Register page
              }}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default Login;
