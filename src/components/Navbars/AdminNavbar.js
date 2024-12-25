import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User Name");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const userId = localStorage.getItem("userId");
      const token = getCookie("token"); // Retrieve the token from cookies

      if (!userId) {
        setError('User ID not found in localStorage.');
        return;
      }

      if (!token) {
        setError('Token not found in cookies.');
        return;
      }

      // Use the stored userName for initial rendering (if available)
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }

      // Trigger the API request to ensure the userName is up-to-date
      try {
        const response = await axios.post(
          `${apiUrl}/csjdbcuyhbe/cskjbcuhbcuwh/${userId}`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the token in the Authorization header
              Id: userId,                        // Pass userId as Id in the headers
            },
          }
        );

        if (response.data.success && response.data.data) {
          const fetchedUserName = response.data.data.name;
          setUserName(fetchedUserName);
          localStorage.setItem("userName", fetchedUserName);
        } else {
          setError('Error fetching user name.');
        }
      } catch (err) {
        setError('Error fetching user name.');
      }
    };

    fetchUserName();
  }, [apiUrl]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/Home ');
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/admin/index"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    {/* Replace image with FontAwesome user icon */}
                    <FaUserCircle size={40} color="white" />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {error ? "Error" : userName}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
