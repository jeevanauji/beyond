import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setMessage("");
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (signup or login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        // Signup request
        const res = await axios.post("http://localhost:3000/api/auth/signup", {
          username: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        });
        setMessage("✅ Signup successful! You can now log in.");
        setIsSignup(false);
      } else {
        // Login request
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // Store JWT token
        localStorage.setItem("token", res.data.token);
        setMessage("✅ Login successful!");

        // Notify parent that user is logged in
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Something went wrong.");
    }
  };

  return (
    <>
      <section className="text-center">
        {/* Top banner background */}
        <div
          className="p-5 bg-image"
          style={{
            backgroundImage:
              "url(https://mdbootstrap.com/img/new/textures/full/171.jpg)",
            height: "300px",
          }}
        ></div>

        {/* Card form container */}
        <div
          className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary"
          style={{ marginTop: "-100px", backdropFilter: "blur(30px)" }}
        >
          <div className="card-body py-5 px-md-5">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-5">
                  {isSignup ? "Sign up now" : "Log in"}
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  {isSignup && (
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="form-control"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-label" htmlFor="firstName">
                            First name
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-label" htmlFor="lastName">
                            Last name
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label" htmlFor="email">
                      Email address
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    {isSignup ? "Sign up" : "Log in"}
                  </button>
                </form>

                {/* Toggle Login/Signup */}
                <div className="text-center mt-4">
                  <button className="btn btn-link" onClick={toggleMode}>
                    {isSignup
                      ? "Already have an account? Log in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>

                {/* Message */}
                {message && <p className="mt-3 text-info">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
