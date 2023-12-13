import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import BirdFinder from "apis/BirdFinder";
import { BirdsContext } from "context/BirdsContext";
import CaptureFinder from "apis/CaptureFinder";
import { CapturesContext } from "context/CaptureContext";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'

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
  // calendar
  const [date, setDate] = useState(new Date());

  // Get bird info
  const {birds, setBirds} = useContext(BirdsContext);
  const {captures, setCaptures} = useContext(CapturesContext)
  const [ranks, setRanks] = useState([]);

  // Sorting by columns
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Some information we need to send to the pop-up boxes
  const [rfid, setRFID] = useState(null);
  const [species, setSpecies] = useState(null);
  const [lband, setLBand] = useState(null);
  const [rband, setRBand] = useState(null);
  const [bandno, setBandNo] = useState(null);
  const [notes, setNotes] = useState(null);
  const [show, setShow] = useState(false);
  
  // Handling pop-up boxes
  const handleClose = () => setShow(false);
  const [BirdShow, setBirdShow] = useState(false);
  const [editBird, setEditBird] = useState(null);
  const [editShow, setEditShow] = useState(false);

  // ----------------------------------------------------------------------------
  // Get all Bird Info
  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await BirdFinder.get("/");
        setBirds(response.data.data.birds)
      } catch(err) {}
    }
    fetchData();
  }, []);

  // ----------------------------------------------------------------------------
  // Get a specific bird's info when 'viewed'.
  useEffect(() => {
    if (rfid !== null && species !== null) {
      // This code will run when both rfid and species are not null
      fetchCaptureData(rfid, species);
    }
  }, [rfid, species]);

  // ----------------------------------------------------------------------------
  // Initialize ranks based on birds data
  useEffect(() => {
    const initializeRanks = () => {
      if (birds.length > 0 && ranks.length === 0) {
        const initialRanks = Array.from({ length: birds.length }, (_, index) => index + 1);
        setRanks(initialRanks);
      }
    };
  
    // Call the function to initialize ranks
    initializeRanks();
  }, [birds, ranks]);

  // ----------------------------------------------------------------------------
  // Make sure the rankings stay the same after columns are sorted.
  const handleSort = (columnName) => {
    const order = sortBy === columnName && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(columnName);
    setSortOrder(order);
  
    // Step 1: Add an index property to each bird object
    const birdsWithIndex = birds.map((bird, index) => ({ ...bird, index }));
  
    // Step 2: Sort the birds array while retaining the original order for equal species
    const sortedBirds = birdsWithIndex.sort((a, b) => {
      if (a[columnName] === b[columnName]) {
        return a.index - b.index; // Retain original order if species values are equal
      }
      if (typeof a[columnName] === 'string' && typeof b[columnName] === 'string'){
        if (order === 'asc') {
          return a[columnName].localeCompare(b[columnName]);
        } else {
          return b[columnName].localeCompare(a[columnName]);
        }
      } else {
        if (order === 'asc') {
          return a[columnName] - b[columnName]; // Compare numeric values directly for ascending order
        } else {
          return b[columnName] - a[columnName]; // Compare numeric values directly for descending order
        }
      }
    });
  
    // Step 3: Update the state with the sorted birds without the index property
    setBirds(sortedBirds.map(bird => ({ ...bird, index: undefined })));
  
    // Step 4: Update the ranks state based on the sorted indexes
    const sortedIndexes = sortedBirds.map(bird => bird.index);
    const newRanks = sortedIndexes.map(index => ranks[index]);
    setRanks(newRanks);
  };  

  // ----------------------------------------------------------------------------
  // Make a View pop-up box show up!
  const handleViewShow = async(rfid, species, lband, rband, bandno, notes) => {
    setRFID(rfid);
    setSpecies(species);
    setRBand(rband);
    setLBand(lband);
    setBandNo(bandno);
    setNotes(notes);
    setBirdShow(true);
  };

  const handleCloseViewModal = () => {
    setBirdShow(false);
  };
  
  // ----------------------------------------------------------------------------
  // Make an Edit pop-up box show up!
  const handleEdit = (bird) => {
    setEditBird(bird);
    setEditShow(true);
  };

  const handleCloseEditModal = () => {
    setEditBird(null);
    setEditShow(false);
  };

  // ----------------------------------------------------------------------------
  // Grab data from captures
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

  // ----------------------------------------------------------------------------
  // Handle deleting a bird from the database. 
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
        {/* <div className='calendar-container'>
          <h4>Calendar</h4>
          <Calendar onChange={setDate} value={date} />
        </div>
        <p className='text-left'>
          <span className='bold'>Selected Date: </span>{date.toDateString()}
        </p> */}
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
                  <th className="border-0 caret ">Rank</th>
                  <th className="border-0">RFID</th>
                  <th className="border-0">Band No.</th>
                  <th className="border-0 th-clickable" onClick={() => handleSort('species')}>Species</th>
                  <th className="border-0">Dom Score</th>
                  <th className="border-0"></th>
                  <th className="border-0"></th>
                </tr>
              </thead>
              <tbody>
                {birds.map((bird, index) => (
                    <tr key={bird.rfid}>
                      <td>{ranks[index] === 1 ? (
                        <img src={require("assets/img/first.png")} style={{ width: '25px', height: '25px'}} />
                      ) : ranks[index] === 2 ? (
                        <img src={require("assets/img/second.png")} style={{ width: '25px', height: '25px'}}/>
                      ) : ranks[index] === 3 ? (
                        <img src={require("assets/img/third.png")} style={{ width: '25px', height: '25px'}}/>
                      ) : ( ranks[index]
                      ) }</td>
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
                            <Dropdown.Item onClick={() => handleEdit(bird)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setShow(true)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  )
                )}                   
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Delete Bird Popup*/}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title> <b style={{ fontWeight: 'bold' }}>Delete Bird?</b></Modal.Title>
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

      {/* View Bird Popup*/}
      <Modal
      size="lg" 
      show={BirdShow} 
      onHide={handleCloseViewModal}
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
                      <th className="border-0">Left Leg</th>
                      <th className="border-0">Right Leg</th>
                      <th className="border-0">Tarsus</th>
                      <th className="border-0">Skull</th>
                      <th className="border-0">Wing</th>
                      <th className="border-0">Body Mass</th>
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
      </Modal>

       {/*Edit Bird Popup*/}
      <Modal 
      show={editShow} 
      onHide={handleCloseEditModal}
      centered="true"
      animation="true">
         <Modal.Header closeButton>
          <Modal.Title>
            <h3><b style={{ fontWeight: 'bold' }}>Edit Bird?</b> <i>{editBird && editBird.rfid}</i></h3>
            <h4><b style={{ fontWeight: 'bold' }}>Band No.</b> <i>{editBird && editBird.band_no}</i></h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" value={editBird && editBird.species} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleSaveChanges(editBird)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Hierarchy;
