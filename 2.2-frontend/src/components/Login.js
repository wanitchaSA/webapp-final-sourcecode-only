import React from "react";
import { useForm } from "react-hook-form";

import PropTypes from "prop-types";
import { Form, Button, Row } from "react-bootstrap";

export function Login({ email, password, onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <Form onSubmit={handleSubmit(onLogin)} style={{backgroundColor:"#ADD8E6", padding: "50px"}}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Row style={{ textAlign: "center", paddingTop: "20px", fontFamily: "cursive"}}>
          <h2>6213365 Company's</h2>
          <h1>STOCK SYSTEM</h1>
        </Row>
        <Form.Label style={{fontFamily:"georgia"}}>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          defaultValue={email}
          {...register("email", { required: true })}
        />
        {/* <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text> */}
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label style={{fontFamily:"georgia"}}>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          defaultValue={password}
          {...register("password", { required: true, min: 8 })}
        />
        {/* <Form.Text className="text-muted">
          We'll never share your password with anyone else.
        </Form.Text> */}
      </Form.Group>

      {/* <input type="submit" /> */}
      <div className="d-grid gap-2">
        <Button type="submit" variant="success">
          Login
        </Button>
      </div>
    </Form>
  );
}

Login.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  onLogin: PropTypes.func,
};

Login.defaultProps = {
  email: null,
  password: false,
  onLogin: undefined,
};
