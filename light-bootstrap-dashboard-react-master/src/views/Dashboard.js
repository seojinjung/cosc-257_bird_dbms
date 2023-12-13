import React, {useContext, useEffect} from "react";
import { useState } from 'react';
import BirdFinder from "apis/BirdFinder";
import { BirdsContext } from "context/BirdsContext.js";
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
  const [editShow, setEditShow] = useState(false);

  const [editBird, setEditBird] = useState(null);
 

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
    if (BirdShow || editShow && rfid && species) {
      fetchCaptureData(rfid);
    }
  }, [editShow, rfid, species]);

  useEffect(() => {
    if (editBird) {
      setEditBird(prevEditBird => ({
        ...prevEditBird,
        captures: captures || {}, // Ensure captures is not null
      }));
    }
  }, [captures]);

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
  const handleEdit = async(bird, rfid, species) => {
    setRFID(rfid);
    setSpecies(species);
    fetchCaptureData(rfid);
    setEditBird({ ...bird, captures: { ...captures } }); 
    setEditShow(true);
  };

  const handleCloseEditModal = () => {
    setEditBird(null);
    setEditShow(false);
  };

  const handleInputChange = (e) => {
    if (editBird) {
      const { name, value } = e.target;
      if (name.startsWith('captures.')) {
        const [, nestedProperty] = name.split('.');
        const updatedEditBird = {
          ...editBird,
          captures: {
            ...editBird.captures,
            [nestedProperty]: value,
          },
        };
        setEditBird(updatedEditBird);
      } else {
        setEditBird({
          ...editBird,
          [name]: value,
        });
      }
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      if(editBird) {
        console.log(editBird)
      const birdresponse = await BirdFinder.put(`/${rfid}`, {
        rfid: editBird.rfid,
        band_no: editBird.band_no,
        species: editBird.species,
        band_left: editBird.band_left,
        band_right: editBird.band_right,
        dom_score: editBird.dom_score,
        notes: editBird.notes,
      });
      const catchresponse = await CaptureFinder.put(`/${rfid}`, {
        rfid: editBird.captures.rfid,
        clocation: editBird.captures.clocation,
        cdate: editBird.captures.cdate,
        tarsus: editBird.captures.tarsus,
        skull: editBird.captures.skull,
        wing: editBird.captures.wing,
        body_mass: editBird.captures.body_mass,
      });
      console.log('Bird information updated.');
      handleCloseEditModal();
      window.location.reload();

    }} catch (error) {
      console.error('Failed to update bird information:', error.message);
    }
  };

  // ----------------------------------------------------------------------------
  // Grab data from captures
  const fetchCaptureData = async (rfid) => {
    try {
      const response = await CaptureFinder.get(`/${rfid}`);
      setCaptures(response.data.data.captures);
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
                                <Dropdown.Item onClick={() => handleEdit(bird, bird.rfid, bird.species)}>
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
            <h3><b style={{ fontWeight: 'bold' }}>Edit Bird?</b></h3>
          </Modal.Title>
        </Modal.Header>
        {editBird && (
        <Modal.Body>
          <div>
            <label style={{ fontWeight: 'bold' }}>Band No:</label>
            <input
              type="text"
              defaultValue={editBird.band_no}
              onChange={handleInputChange}
              name="band_no"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Species:</label>
            <input
              type="text"
              value={editBird.species}
              onChange={handleInputChange}
              name="species"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Left Leg:</label>
            <input
              type="text"
              value={editBird.band_left}
              onChange={handleInputChange}
              name="band_left"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Right Leg:</label>
            <input
              type="text"
              value={editBird.band_right}
              onChange={handleInputChange}
              name="band_right"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Tarsus:</label>
            <input
            type="text"
            value={editBird.captures.tarsus}
            onChange={handleInputChange}
            name="captures.tarsus"
          />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Skull:</label>
            <input
              type="text"
              value={captures.skull}
              onChange={handleInputChange}
              name="captures.skull"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Wing:</label>
            <input
              type="text"
              value={captures.wing}
              onChange={handleInputChange}
              name="captures.wing"
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Body Mass:</label>
            <input
              type="text"
              value={captures.body_mass}
              onChange={handleInputChange}
              name="captures.body_mass"
            />
          </div>
    {/* Add more input fields for other attributes */}
  </Modal.Body> )}
        <Modal.Footer>
          <Button className="btn-fill btn-wd" variant="info" onClick={handleSaveChanges} >
            Confirm
          </Button>
          <Button variant="info" onClick={handleCloseEditModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Hierarchy;
