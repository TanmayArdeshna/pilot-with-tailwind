import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  // State variables for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [flightExperience, setFlightExperience] = useState('');
  const [rtr, setRtr] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [isComputer, setIsComputer] = useState('');
  const [flightSchool, setFlightSchool] = useState('');
  const [airline, setAirline] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for error handling
  const [error, setError] = useState('');

  // State for country codes
  const [countryCodes, setCountryCodes] = useState([]);

  // Fetch country codes dynamically and sort them
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const codes = response.data.map((country) => ({
          name: country.name.common,
          code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
        }))
          .filter(country => country.code) // Filter out any countries without codes
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by country name

        setCountryCodes(codes);
      } catch (err) {
        console.error('Error fetching country codes:', err);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleCreateAccount = async () => {
    setError(''); // Clear previous error

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation
    if (!name || !email || !password || !number || !country || !countryCode) {
        setError('All mandatory fields are required.');
        return;
    }
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (!/^\d{10}$/.test(number)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    try {
        const data = {
            name,
            email,
            password,
            number,
            countryCode,
            flightExperience,
            rtr,
            country,
            city,
            isComputer,
            flightSchool: flightSchool || '',
            airline: airline || '',
        };

        const response = await axios.post(`https://auth.thepilotprep.com/api/auth/user/signin/vkjdbfuhe/nkdkjbed`, data);

        if (response.status === 200 && response.data.success) {
            const { id, token } = response.data.data;

            // Store userId in localStorage
            localStorage.setItem('userId', id);

            // Set token in cookies with a 24-hour expiration
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
            document.cookie = `token=${token}; path=/; secure; expires=${expirationDate.toUTCString()}`;

            // Navigate to the desired page after successful registration
            navigate('/admin/index');
        } else {
            setError(response.data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error); // Display the error message from the API response
        } else {
            setError('An error occurred while creating the account.');
        }
        console.error('Error creating account:', error);
    }
};

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #3a7bd5 0%, #3a6073 100%)',
      padding: '50px 0'
    }}>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up with credentials</small>
            </div>
            <Form role="form">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
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
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-compass-04" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    value={countryCode}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setCountryCode(selectedCode);

                      // Find the corresponding country name based on the selected country code
                      const selectedCountry = countryCodes.find((country) => country.code === selectedCode);
                      if (selectedCountry) {
                        setCountry(selectedCountry.name);
                      } else {
                        setCountry(''); // Clear country if no match is found
                      }
                    }}
                  >
                    <option value="">Select Country Code</option>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </Input>
                  {/* Show the selected country next to the dropdown */}
                  <InputGroupAddon addonType="append">
                    <InputGroupText>{country || "Select a country"}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Phone Number"
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              
              {/* <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-square-pin" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </InputGroup>
              </FormGroup> */}

              
              
              
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}  // Show or hide password
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Toggle between eye and eye slash icons */}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {/* <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row> */}
              <div className="text-center">
                <Button className="mt-4" color="primary" type="button" onClick={handleCreateAccount}>
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col className="text-right" xs="12">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login'); // Navigate to the Login page
              }}
            >
              <small>Already have an account?</small>
            </a>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default Register;
