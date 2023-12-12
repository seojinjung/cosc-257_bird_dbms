import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import BirdFinder from "apis/BirdFinder";
import { BirdsContext } from "context/BirdsContext";
import CaptureFinder from "apis/CaptureFinder";
import { CapturesContext } from "context/CaptureContext";

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
  const {captures, setCaptures} = useContext(CapturesContext)
  
  const [rfid, setRFID] = useState(null);
  const [species, setSpecies] = useState(null);
  const [lband, setLBand] = useState(null);
  const [rband, setRBand] = useState(null);
  const [bandno, setBandNo] = useState(null);
  const [notes, setNotes] = useState(null);
  const [show, setShow] = useState(false);
  const [BirdShow, setBirdShow] = useState(false);
  
  const handleClose = () => setShow(false);

  useEffect(() => {
    if (rfid !== null && species !== null) {
      // Your logic here that you want to execute when rfid and species change
      // This code will run when both rfid and species are not null
      fetchCaptureData(rfid, species);
    }
  }, [rfid, species]);

  const handleViewShow = async(rfid, species, lband, rband, bandno, notes) => {
    setRFID(rfid);
    setSpecies(species);
    setRBand(rband);
    setLBand(lband);
    setBandNo(bandno);
    setNotes(notes);
    setBirdShow(true);
  };
  
  const fetchCaptureData = async (rfid, species) => {
    try {
      const response = await CaptureFinder.get(`/${rfid}`);
      setCaptures(response.data.data.captures);
      setBirdShow(true);
      // Other logic based on fetched data
    } catch (err) {
      // Handle error if needed
    }
  };

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
    }
  }; 

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
                      <th className="border-0">Rank</th>
                      <th className="border-0">RFID</th>
                      <th className="border-0">Band No.</th>
                      <th className="border-0">Species</th>
                      <th className="border-0">Dominance Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {birds.map(bird => {
                      return(
                        <tr>
                          <td>{1}</td>
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
                              <Dropdown.Item onClick={() => handleViewShow(bird.rfid, bird.species, bird.band_left, bird.band_right, bird.band_no, bird.notes)}>
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


      <Modal 
      show={show} 
      onHide={() => setShow(false)}
      >
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
      show={BirdShow} 
      onHide={() => setBirdShow(false)}
      centered="true"
      animation="true">
        <Modal.Header closeButton>
          <Modal.Title>
            <h3> <b style={{ fontWeight: 'bold' }}>RFID:</b> <i>{rfid}</i></h3>
            <h4> <b style={{ fontWeight: 'bold' }}>Band No.</b> <i>{bandno}</i></h4>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <div className="image-cropper">
                  {typeof species === 'string' ? (
                  <>
                    {species.trim() === 'TUTI' ? (
                      <>
                        <img src={require("assets/img/tuft.png")} />
                      </>
                      ) : species.trim() === 'BCCH' ? (
                      <>
                        <img src={require("assets/img/chick.png")}/>
                      </>
                      ) : species.trim() === 'WBNU' ? (
                        <>
                          <img src={require("assets/img/nuthatch.png")}/>
                        </>
                    ) : (
                      <p>No image available for this species</p>
                    )}
                  </>
                ) : (
                  <p>Invalid species data type</p>
                )}
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
                  {captures && (
                    <tbody>
                      <tr key={captures.id}>
                        <td>{lband}</td>
                        <td>{rband}</td>
                        <td>{captures.tarsus}</td>
                        <td>{captures.skull}</td>
                        <td>{captures.wing}</td>
                        <td>{captures.body_mass}</td>
                      </tr>
                    </tbody>
                  )}
                </Table>
                {notes && (
                <i className="subtext">Notes: {notes}</i>
                  )}
              </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Hierarchy;
