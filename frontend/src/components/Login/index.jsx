/*import React, { useState } from 'react';
import axios from "axios";
import { FaUserCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import './login.css';
import NavBar from '../Home/Navbar';

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        formData
      );
      console.log(response.data);

      const { userId, email, username } = response.data;

      // Store the user information in AsyncStorage
      await AsyncStorage.setItem("userId", userId.toString());
      await AsyncStorage.setItem("userEmail", email || username);

      toast.success("Logged in successfully!");
      navigate(`/PhrasebookHome`);
    } catch (error) {
      console.error("Login error:", error.response.data.error);
      toast.error("Login error!");

      // Assuming errors are sent in the response data with a key `errors`
      setErrors(error.response.data.errors || {});
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <NavBar />
      </nav>
      <div className="background">
        <div className="card col-md-6 col-lg-4 mx-auto mt-5" style={{marginTop:'-100px'}}>
          <h1 className="card-header">
            Login <FaUserCheck />
          </h1>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="emailOrUsername" className="form-label">
                  Email or Username:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.emailOrUsername ? "is-invalid" : ""}`}
                  id="emailOrUsername"
                  name="emailOrUsername"
                  placeholder="Enter your email or username"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
                {errors.emailOrUsername && <div className="invalid-feedback">{errors.emailOrUsername}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Index;

*/

import React, { useState } from 'react';
import axios from "axios";
import { FaUserCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import './login.css';
import NavBar from '../Home/Navbar';

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { emailOrUsername, password } = formData;

    // Check if the admin credentials are provided
    if (emailOrUsername === "admin" && password === "123456") {
      toast.success("Admin logged in successfully!");
      navigate(`/admin`);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        formData
      );
      console.log(response.data);

      const { userId, email, username } = response.data;

      // Store the user information in AsyncStorage
      await AsyncStorage.setItem("userId", userId.toString());
      await AsyncStorage.setItem("userEmail", email || username);

      toast.success("Logged in successfully!");
      navigate(`/PhrasebookHome`);
    } catch (error) {
      console.error("Login error:", error.response.data.error);
      toast.error("Login error!");

      // Assuming errors are sent in the response data with a key `errors`
      setErrors(error.response.data.errors || {});
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <NavBar />
      </nav>
      <div className="background">
        <div className="card col-md-6 col-lg-4 mx-auto mt-5" style={{marginTop:'-100px'}}>
          <h1 className="card-header">
            Login <FaUserCheck />
          </h1>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="emailOrUsername" className="form-label">
                  Email or Username:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.emailOrUsername ? "is-invalid" : ""}`}
                  id="emailOrUsername"
                  name="emailOrUsername"
                  placeholder="Enter your email or username"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
                {errors.emailOrUsername && <div className="invalid-feedback">{errors.emailOrUsername}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Index;

