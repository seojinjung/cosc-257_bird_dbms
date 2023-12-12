import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import FeederFinder from "apis/FeederFinder";
import { FeederContext } from "context/FeederContext";
import VisitFinder from "apis/VisitFinder";
import { VisitContext } from "context/VisitContext";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Modal,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function FeederList() {
  const {feeders, setFeeders} = useContext(FeederContext);
  const {visits, setVisits} = useContext(VisitContext);
  
  const [fname, setFname] = useState(null);
  const [lgShow, setLgShow] = useState(false);

  const handleViewShow = async(fname) => {
    setFname(fname);
    setLgShow(true);
  }

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await FeederFinder.get("/");
        setFeeders(response.data.data.feeders)
      } catch(err) {}
    }
    fetchData();
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="feeder-table">
              <Card.Header>
                <Card.Title as="h4">List of feeders</Card.Title>
                <p className="card-category">
                  Feeder names and locations. Click the options icon on the right of each feeder to view and edit details for that feeder.
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">Name</th>
                      <th className="border-0">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeders.map(feeder => {
                      return(
                        <tr>
                          <td>{feeder.fname}</td>
                          <td>{feeder.latitude}, {feeder.longitude}</td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="default"
                                style={{border: "none"}}
                              >
                                <div className="logo-img">
                                  <img src={require("assets/img/more.png")} alt="..." />
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewShow(feeder.fname)}>
                                  View
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => e.preventDefault()}>
                                  Edit
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}   
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
      size="lg" 
      show={lgShow} 
      onHide={() => setLgShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{fname}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <div class="image-cropper">
                    <img
                      src={require("assets/img/feeder.png")}
                    ></img>
                </div>
                <Table className="table-hover table-fixed">
                  <thead>
                    <tr class="same-col-widths text-align: left">
                      <th className="border-0">Location</th>
                      <th className="border-0">Total visits</th>
                      <th className="border-0">Visits in last 30 days</th>
                      <th className="border-0">Most frequently visiting species</th>
                      <th className="border-0">Least frequently visiting species</th>
                    </tr>
                  </thead>
                  <tbody>
                        <tr>
                          
                        </tr>                     
                  </tbody>
                </Table>
              </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FeederList;
