import React from "react";

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

function TableList() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Striped Table with Hover</Card.Title>
                <p className="card-category">
                  Here is a subtitle for this table
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Salary</th>
                      <th className="border-0">Country</th>
                      <th className="border-0">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Sample #1</td>
                      <td>$0</td>
                      <td>Location</td>
                      <td>City</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Sample #2</td>
                      <td>$0</td>
                      <td>Location</td>
                      <td>City</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sample #3</td>
                      <td>$0</td>
                      <td>Location</td>
                      <td>City</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Sample #4</td>
                      <td>$0</td>
                      <td>Location</td>
                      <td>City</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Sample #5</td>
                      <td>$0</td>
                      <td>Location</td>
                      <td>City</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Sample #6</td>
                      <td>$0</td>
                      <td>Locatiom</td>
                      <td>City</td>
                    </tr>
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

export default TableList;
