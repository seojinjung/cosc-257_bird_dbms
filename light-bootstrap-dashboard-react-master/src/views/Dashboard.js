import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import BirdFinder from "apis/BirdFinder";
import { BirdsContext } from "context/BirdsContext";

// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";



function Hierarchy() {
  // Get bird info
  const {birds, setBirds} = useContext(BirdsContext);
  
  const [rfid, setRFID] = useState(null);
  const [show, setShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleViewShow = async(rfid) => {
    setRFID(rfid);
    setLgShow(true);
  }
  

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
                              <Dropdown.Item onClick={() => handleViewShow(bird.rfid)}>
                                  View
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => e.preventDefault()}>
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setShow(true)}>
                                  Delete
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
      </Container>


      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete bird?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action will delete this bird and its associated information from the database.</Modal.Body>
        <Modal.Footer>
          <Button className="btn-fill btn-wd" variant="info" onClick={() => handleDelete(bird.rfid)} >
            Confirm
          </Button>
          <Button variant="info" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
      size="lg" 
      show={lgShow} 
      onHide={() => setLgShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{rfid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <div class="image-cropper">
                    <img
                      src={require("assets/img/tuft.png")}
                    ></img>
                </div>
                <Table className="table-hover table-fixed">
                  <thead>
                    <tr class="same-col-widths text-align: center">
                      <th className="border-0">Tarsus</th>
                      <th className="border-0">Skull</th>
                      <th className="border-0">Wing</th>
                      <th className="border-0">Body Mass</th>
                      <th className="border-0">Location</th>
                      <th className="border-0">Left Leg</th>
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

export default Hierarchy;
