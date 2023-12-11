import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import BirdFinder from "apis/BirdFinder";
import { BirdsContext } from "context/BirdsContext";
import { Link } from 'react-router-dom';

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Button,
  Modal
} from "react-bootstrap";


function Hierarchy() {
  const {birds, setBirds} = useContext(BirdsContext)
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await BirdFinder.get("/");
        setBirds(response.data.data.birds)
      } catch(err) {}
    }
    fetchData();
  }, []);

  const handleDelete = async(rfid) => {
    try {
      const response = await BirdFinder.delete(`/${rfid}`);
      setBirds(
        birds.filter((bird) => {
          return bird.rfid !== rfid;
        })
      );
    } catch(err) {
      console.log(err);
    }
  } 

  const handleView = async(rfid) => {
    const fetchData = async() => {
      try {
        const response = await BirdFinder.get(`/${rfid}`);
        window.open(`/bird/${rfid}`, '_blank');
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
  }

  return (
    <>
      <Container fluid>
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Dominance Hierarchy</Card.Title>
                <p className="card-category">
                  Currently displaying data from 2021-2022 {/** possible to add metadata so this updates automatically year to year? */}
                </p> 
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">RFID</th>
                      <th className="border-0">Band No.</th>
                      <th className="border-0">Species</th>
                      <th className="border-0">Dominance Score</th>
                      <th className="border-0"></th>
                      <th className="border-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {birds.map(bird => {
                      return(
                        <tr>
                          <td>{bird.rfid}</td>
                          <td>{bird.band_no}</td>
                          <td>{bird.species}</td>
                          <td>{bird.dom_score}</td>
                          <td>
                            <Button onClick={() => handleView(bird.rfid)} className="btn-fill btn-wd" variant="info">
                              View
                            </Button>
                          </td>
                          <td>
                            <Button className="btn-fill btn-wd" variant="info">
                              Edit
                            </Button>
                          </td>
                          <td>
                            <Button onClick={handleShow} className="btn-fill btn-wd" variant="info">
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}                     
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete bird?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action will delete this bird and associated information from the database.</Modal.Body>
        <Modal.Footer>
          <Button className="btn-fill btn-wd" variant="info" onClick={() => handleDelete(bird.rfid)} >
            Confirm
          </Button>
          <Button variant="info" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Hierarchy;
