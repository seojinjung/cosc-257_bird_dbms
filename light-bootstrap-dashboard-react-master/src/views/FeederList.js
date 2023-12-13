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
  // feeder and visit/score info
  const {feeders, setFeeders} = useContext(FeederContext);
  const {scores, setScores} = useContext(ScoreContext);
  
  // pop-up view info
  const [fname, setFname] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [totalVisits, setTotalVisits] = useState(null);
  const [thirtyDays, setThirtyDays] = useState(null);
  const [mostVisits, setMostVisits] = useState(null);
  const [leastVisits, setLeastVisits] = useState(null);
  const [show, setShow] = useState(false);

  // pop-up handling
  const [feederShow, setFeederShow] = useState(false);
  const handleClose = () => setShow(false);

  // all info from feeder table
  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await FeederFinder.get("/");
        setFeeders(response.data.data.feeders)
      } catch(err) {}
    }
    fetchData();
  }, []);

  // additional viewing info from scores table
  useEffect(() => {
    if (fname !== null) {
      // fetch visit data if fname is not null
      fetchVisitData(fname)
    }
  }, [fname]);

  // function for view pop-up
  const handleViewShow = async(fname, latitude, longitude, totalVisits, thirtyDays, mostVisits, leastVisits) => {
    setFname(fname);
    setLatitude(latitude);
    setLongitude(longitude);
    setTotalVisits(totalVisits);
    setThirtyDays(thirtyDays);
    setMostVisits(mostVisits);
    setLeastVisits(leastVisits);
    setFeederShow(true);
  };

  const handleCloseViewModal = () => {
    setFeederShow(false);
  };

  // visit data from scores table
  const fetchVisitData = async (fname) => {
    try {
      const response = await ScoreFinder.get(`/${fname}`);
      setScores(response.data.data.scores);
      setFeederShow(true);
      // Other logic based on fetched data
    } catch (err) {
      // Handle error if needed
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">List of feeders</Card.Title>
                <p className="card-category">
                  Feeder names and locations. Click the options icon to view more details.
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
                                style={{border: "none"}}>
                                <div className="logo-img">
                                  <img src={require("assets/img/more.png")} alt="..." />
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewShow(feeder.fname, feeder.latitude, feeder.longitude)}>
                                  View
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
      show={feederShow} 
      onHide={handleCloseViewModal}
      animation='true'>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3> <b style={{ fontWeight: 'bold' }}>{fname}</b></h3>
            <h4> <i>{latitude}, {longitude}</i></h4>
          </Modal.Title>
          <div class="image-cropper">
            <img
              src={require("assets/img/feeder.png")}
              style={{width: 180, height: 180, float: 'right'}}
            ></img>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Table className="table-hover table-fixed">
            <thead>
              <tr class="same-col-widths text-align: left">
                <th className="border-0">Total visits</th>
                {/* <th className="border-0">Visits in last 30 days</th>
                <th className="border-0">Most frequently visiting species</th>
                <th className="border-0">Least frequently visiting species</th> */}
              </tr>
            </thead>
            {scores && (
              <tbody>
                <tr key={scores.id}>
                  <td>{scores.total}</td>
                  {/* <td>{}</td>
                  <td>{}</td>
                  <td>{}</td> */}
                </tr>                     
              </tbody>
            )}
          </Table>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default FeederList;
