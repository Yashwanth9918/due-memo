import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "react-bootstrap-icons";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ userType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#f3f4f6" }}>
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "20px", textAlign: "center" }}>
        <h2 className="mb-4 fw-bold" style={{ fontSize: "24px" }}>{userType === "customer" ? "Customer Login" : "Vendor Login"}</h2>

        <Form onSubmit={handleLogin} className="text-start">
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
          <Button color="dark" block className="mt-3">Login</Button>
        </Form>

        <p className="text-muted mt-3">
          If not a user, <span style={{ color: "#343a40", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/signup")}>Sign-up!</span>
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Facebook size={20} />
          </button>
          <button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Twitter size={20} />
          </button>
          <button className="btn btn-light border rounded-circle p-2" style={{ width: "40px", height: "40px" }}>
            <Instagram size={20} />
          </button>
        </div>

        <footer className="mt-4 text-muted" style={{ fontSize: "14px" }}>
          <p>abc123@gmail.com</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
