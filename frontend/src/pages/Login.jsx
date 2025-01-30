import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Container } from "reactstrap";

const Login = ({ userType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // // Dummy authentication (Replace with actual authentication logic)
    // if (email === "test@example.com" && password === "password") {
    //   navigate(/${userType}/home); // Redirect to respective home page
    // } else {
    //   alert("Invalid credentials");
    // }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h2>{userType === "customer" ? "Customer Login" : "Vendor Login"}</h2>
      <Form onSubmit={handleLogin} className="w-50">
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
        <Button color="primary" block>Login</Button>
      </Form>
      <p className="mt-3">
        Please signup if new. <Button color="link" >Signup</Button>
      </p>
    </Container>
  );
};

export default Login;