import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className=  "footer fixed-bottom bg-light text-center py-2">
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy;Store Notify</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
