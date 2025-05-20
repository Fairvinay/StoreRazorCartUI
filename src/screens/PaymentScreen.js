import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";
import {   Row  } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import Title from "../components/Title";

const PaymentScreen = () => {
  const shippingAddress = useSelector(state => state.cart.shippingAddress);

  const history = useHistory();

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <>
      <Title title="Store Notify| Payment" />
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group as="fieldset" className="mb-4">
          <Form.Label as="legend" className="fw-semibold">
            Select Payment Method
          </Form.Label>
          <Row className="mt-2 ps-2">
            <Col xs={12} md={6}>
              <Form.Check
                type="radio"
                id="Razorpay"
                name="paymentMethod"
                label="Razorpay UPI / Debit / Credit Card"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
            <Col xs={12} md={6}>
              <Form.Check
                type="radio"
                id="COD"
                name="paymentMethod"
                label="Cash on Delivery"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>
            {/* Optional: Add more options here */}
            {/* 
           
            */}
          </Row>
        </Form.Group>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
