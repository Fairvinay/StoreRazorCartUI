import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link, useParams, useHistory } from "react-router-dom";
import { getOrderDetails, payOrder, updateOrder } from "../actions/orderAction";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ORDER_CREATE_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import Title from "../components/Title";
//import { API_URL } from '../config';

const OrderScreen = () => {

  const apiUrl = useSelector((state) => state.apiConfig.apiUrl); // 🔥 here
  const dispatch = useDispatch();
  const [payment , setPayment ] = useState();
  const { id } = useParams();
  const history = useHistory();

  const [sdkReady, setSdkReady] = useState(false);
  const [orderPaid, setOrderPaid] = useState(false);

  const userInfo = useSelector(state => state.userLogin.userInfo);

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, error, order } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const successOrder = useSelector(state => state.updateOrder.success);

  const [isDelivered, setIsDelivered] = useState(false);

  async function displayRazorpay() {
   

    const { data: clientId } = await axios.get(apiUrl+"/api/config/razorpay");
    const authConfig = {
      headers: {
        Authorization: userInfo.token,
      },
    };
    const { data } = await axios.post(apiUrl+`/api/orders/${id}`, "", authConfig);
    const { amount, currency, orderId } = data;

    const options = {
      key: clientId,
      amount: amount,
      currency: currency,
      name: id,
      description: id,
      order_id: orderId,
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
      },
      notes: {
        shippingAddress: orderDetails.order.shippingAddress.address,
      },
      handler: function (response) {
        if (response.razorpay_payment_id) {
          const paymentResult = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            email_address: userInfo.email,
          };
        
          const payResp = { 
                order_id : response.razorpay_order_id,
              payment_id : response.razorpay_payment_id,
              status : response.status,
              email_address: userInfo.email,
              name: response.name,
              price: response.price,
              qty: response.qty,
              paymentMethod: response.paymentMethod,
              paidAt : response.paidAt
          }
            order.orderItems.map((item, index) => {
                payResp.name =   item.name;
                payResp.price =   item.price;
                payResp.qty =   item.qty;
		return payResp ;
              }
             );

          loadPaymentLinkIfIframe();
          setPayment(payResp);
          setOrderPaid(true);
          dispatch(payOrder(id, paymentResult));
          dispatch({ type: ORDER_CREATE_RESET });
        }
      },
    };

    const paymentWindow = new window.Razorpay(options);
    paymentWindow.open();
  }
   const loadScript = url => {
      const script = document.createElement("script");
      script.src = url;
      document.body.appendChild(script);
      script.onload = () => {
        setSdkReady(true);
      };
    }; 

  function loadPaymentLinkIfIframe() {
       loadScript("../js/encloseLinkIfIframeCheckout.js");
  }
	
  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

     

    if (!order || successPay || order._id !== id) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid || !window.Razorpay) {
      loadScript("https://checkout.razorpay.com/v1/checkout.js");
    }
  }, [dispatch, id, order, userInfo, history, successPay]);

  if (!loading && !error) {
    order.itemsPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  }

  useEffect(() => {
    if (successOrder) {
      dispatch(getOrderDetails(id));
    }
  }, [successOrder, dispatch, id]);

  useEffect(() => {
    if (order && order.isDelivered) {
      setIsDelivered(order.isDelivered);
    }
  }, [order]);

  const deliveryHandler = () => {
    dispatch(updateOrder({ isDelivered }, id));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Title title="Store Notify| Order details" />
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email:</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Order Paid at {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">Order Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your Cart is Empty</Message>
              ) : (
                <ListGroup.Item>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x Rs{item.price} = Rs
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>Rs{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <>
                      {!userInfo.isAdmin && (
                        <Button variant="primary" onClick={displayRazorpay}>
                          Pay Now
                        </Button>
                      )}
                    </>
                  )}
                </ListGroup.Item>
              )}
              {orderPaid && (
                <Message variant="info">Payment Done Sucessfully</Message>
              )}
              {userInfo.isAdmin && order.isPaid && (
                <ListGroup.Item>
                  <Form.Check
                    type="checkbox"
                    label="IsDelivered"
                    checked={isDelivered}
                    onChange={e => setIsDelivered(e.target.checked)}
                  ></Form.Check>
                  <Button
                    className="btn-md my-2"
                    variant="dark"
                    onClick={deliveryHandler}
                  >
                    {order.isDelivered ? "Mark undelivered" : "Mark Delivered"}
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card> <p> &nbsp; <br/>  </p> <hr/> <p> </p>
          {order.isPaid && (
          
            <ListGroup variant="flush">
              <ListGroup.Item>
               <Card> 
                 
               <ListGroup.Item>
                <h2>Payment Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Razor Pay Order ID:</Col>
                  <Col> {payment.order_id} </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Razor Pay Payment ID:</Col>
                  <Col id="payDiv">{/* payment_id */}
                  <span id="payId">   {payment.payment_id} </span> </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Pay Status</Col>
                  <Col>{payment.success}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Email Address</Col>
                  <Col>{payment.email_address}</Col>
                </Row>
              </ListGroup.Item>
               <ListGroup.Item>
                <Row>
                  <Col>Product Name </Col>
                  <Col>{payment.name }</Col>
                </Row>
              </ListGroup.Item>
               <ListGroup.Item>
                <Row>
                  <Col>Product Price </Col>
                  <Col>{payment.price }</Col>
                </Row>
              </ListGroup.Item>
               <ListGroup.Item>
                <Row>
                  <Col>Product Qty </Col>
                  <Col>{payment.qty}</Col>
                </Row>
              </ListGroup.Item>
               <ListGroup.Item>
                <Row>
                  <Col>Pay Method </Col>
                  <Col>{payment.paymentMethod} </Col>
                </Row>
              </ListGroup.Item>
                <ListGroup.Item>
                <Row>
                  <Col>Pay At  </Col>
                  <Col>{order.paidAt} </Col>
                </Row>
              </ListGroup.Item>
               </Card>
               </ListGroup.Item>
            </ListGroup>
        
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
