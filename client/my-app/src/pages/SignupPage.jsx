import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";
import styles from "../styles/SignupPage.module.css";
import logo from "../assets/elevate-logo.svg"; // Ensure correct path

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "d5",
    lastName: "p5",
    email: "dp5@gmail.com",
    password: "12345678",
    confirmPassword: "12345678",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate Password & Confirm Password Match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send only required fields (exclude confirmPassword)
      const { firstName, lastName, email, password } = formData;
      const formData1 = new FormData();
      formData1.append("firstName", firstName);
      formData1.append("lastName", lastName);
      formData1.append("email", email);
      formData1.append("password", password);
      formData1.append("role", "STUDENT");

      for (let [key, value] of formData1.entries()) {
          console.log(key, value);
      }

      const response = await createUser(formData1);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={styles.signupContainer}>
      {/* Left Section: Logo (Moves on Top in Mobile) */}
      <div className={styles.leftSection}>
        <img src={logo} alt="Elevate Logo" className={styles.logo} />
      </div>

      {/* Divider (Hidden on Small Screens) */}
      <div className={styles.divider}></div>

      {/* Right Section: Signup Form */}
      <div className={styles.rightSection}>
        <form onSubmit={handleSignup} className={styles.signupForm}>
          <h2 className={styles.formTitle}>Sign Up</h2>

          {error && <p className={styles.error}>{error}</p>}

          {/* Name Fields */}
          <div className={styles.nameFields}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-Enter Password"
            className={styles.input}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Signup Button */}
          <button type="submit" className={styles.signupButton}>Sign Up</button>

          {/* Login Link */}
          <p className={styles.loginLink} onClick={() => navigate("/login")}>
            Already a user?
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;