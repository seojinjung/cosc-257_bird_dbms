import React, {useContext, useEffect} from "react";
import FeederFinder from "apis/FeederFinder";
import { FeederContext } from "context/FeederContext";

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
} from "react-bootstrap";

function FeederList() {
  const {feeders, setFeeders} = useContext(FeederContext)

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
                  Feeder names and locations.
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
    </>
  );
}

export default FeederList;
