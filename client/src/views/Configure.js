import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import FeederFinder from "apis/FeederFinder";
import { FeederContext } from "context/FeederContext";
import ScoreFinder from "apis/ScoreFinder";
import { ScoreContext } from "context/ScoreContext";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Configure() {
  return (
    <>
    <Container fluid>
      <Row>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center stats">
                    <i className="nc-icon nc-cloud-upload-94"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <Card.Title as="h4">Upload Feeders</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">
                Last Updated: 7/20/2024
              </div>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center stats">
                    <i className="nc-icon nc-simple-add"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <Card.Title as="h4">Update Birds</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">
              Last Updated: 7/20/2024
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
  );
}

export default Configure;
