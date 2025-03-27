import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "react-bootstrap-icons";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = ({ userType }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:4000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phoneNumber: mobile, password, role: userType }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Sign-up successful! Please log in.");
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        setError(data.message || "Sign-up failed. Try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "20px", textAlign: "center" }}>
        <h2 className="mb-4 fw-bold" style={{ fontSize: "24px" }}>
          {userType === "customer" ? "Customer Sign-Up" : "Vendor Sign-Up"}
        </h2>

        <Form onSubmit={handleSignUp} className="text-start">
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="mobile">Mobile Number</Label>
            <Input
              type="tel"
              name="mobile"
              id="mobile"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button color="dark" block className="mt-3">
            Sign-Up
          </Button>
        </Form>

        <p className="text-muted mt-3">
          Already have an account?{" "}
          <span
            style={{ color: "#343a40", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate(`/login/${userType}`)}
          >
            Login!
          </span>
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Facebook size={20} />
          </Button>
          <Button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Twitter size={20} />
          </Button>
          <Button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Instagram size={20} />
          </Button>
        </div>

        <footer className="mt-4 text-muted" style={{ fontSize: "14px" }}>
          <p>abc123@gmail.com</p>
        </footer>
      </div>
    </div>
  );
};

export default SignUp;
