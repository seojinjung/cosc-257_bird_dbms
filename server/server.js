require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// get all birds
app.get("/api/v1/birds", async (req, res) => {

    try{
        const results = await db.query("select * from birds order by dom_score desc");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                birds: results.rows,
            },
        });
    } catch(err) {
        console.log(err);
    }
    
});

// get one bird
app.get("/api/v1/birds/:rfid", async (req, res) => {
    try{
        const results = await db.query("select * from birds where rfid = $1", [req.params.rfid]);

        res.status(200).json({
            status: "success",
            data: {
                birds: results.rows[0],
            },
        });
    } catch(err) {
        console.log(err);
    }

});

// Create a bird
app.post("/api/v1/birds", async (req, res) => {
    try{
        const results = await db.query("INSERT INTO birds (rfid, band_no, species, band_left, band_right, dom_score, notes) values ($1, $2, $3, $4, $5, $6, $7) returning *",
        [req.body.rfid, req.body.band_no, req.body.species, req.body.band_left, req.body.band_right, req.body.dom_score, req.body.notes]
        );;        
        res.status(201).json({
            status: "success",
            data: {
                birds: results.rows[0]
            }
        });
    } catch(err) {
        console.log(err);
    }
    
});

// Update bird
app.put("/api/v1/birds/:rfid", async (req, res) => {
    try{
        const results = await db.query("UPDATE birds SET rfid = $1, band_no = $2, species = $3, band_left = $4, band_right = $5, dom_score = $6, notes = $7 where rfid = $8 returning *",
        [req.body.rfid, req.body.band_no, req.body.species, req.body.band_left, req.body.band_right, req.body.dom_score, req.body.notes, req.params.rfid]
        );
       
        res.status(201).json({
            status: "success",
            data: {
                birds: results.rows[0]
            }
        });
    } catch(err) {
        console.log(err);
    }

});

// Delete bird
app.delete("/api/v1/birds/:rfid", async (req, res) => {

    try{
        const results = await db.query("DELETE FROM birds WHERE rfid = $1", [req.params.rfid]
        );
       
        res.status(201).json({
            status: "success",
            data: {
                birds: results.rows[0]
            }
        });
    } catch(err) {
        console.log(err);
    }

});

// get all feeders
app.get("/api/v1/feeders", async (req, res) => {

    try{
        const results = await db.query("select * from feeders order by fname asc");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                feeders: results.rows,
            },
        });
    } catch(err) {
        console.log(err);
    }
    
});

// Get one bird's capture data
app.get("/api/v1/captures/:rfid", async (req, res) => {
    try{
        const results = await db.query("select * from captures where rfid = $1", [req.params.rfid]);

        res.status(200).json({
            status: "success",
            data: {
                captures: results.rows[0],
            },
        });
    } catch(err) {
        console.log(err);
    }

});

// get a feeder's visit data from the scores table
app.get("/api/v1/scores/:fname", async (req, res) => {
    try{
        const results = await db.query("select * from scores where fname = $1", [req.params.fname]);

        res.status(200).json({
            status: "success",
            data: {
                scores: results.rows[0],
            },
        });
    } catch(err) {
        console.log(err);
    }

});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});