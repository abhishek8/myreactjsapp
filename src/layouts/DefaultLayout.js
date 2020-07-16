import React from "react";
import { Route } from "react-router-dom";

import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DefaultLayout = ({ children }) => (
  <div className="main">
    <NavigationBar />
    <Container
      className="container-wrap"
      fluid="md"
      style={{ backgroundColor: "white" }}
    >
      <Row>
        <Col>{children}</Col>
      </Row>
    </Container>
    <Footer />
  </div>
);

const DefaultLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <DefaultLayout>
          <Component {...matchProps} />
        </DefaultLayout>
      )}
    />
  );
};

export default DefaultLayoutRoute;
