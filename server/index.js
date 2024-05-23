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
        // Extract start and end parameters from the query string
        const startDate = req.query.start;
        const endDate = req.query.end;

        // Construct the SQL query using parameterized query to prevent SQL injection
        const query = `
            SELECT * 
            FROM birds 
            WHERE rfid IN (SELECT rfid FROM captures WHERE cdate BETWEEN $1 AND $2) 
            ORDER BY dom_score DESC`;

        // Execute the SQL query against the database
        console.log(req)
        const results = await db.query(query, [startDate, endDate]);
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

// get all landings
app.get("/api/v1/landings", async (req, res) => {

    try{
        const query = "WITH domscore AS (SELECT rfid, feeder, time_s, datetime, LAG(rfid) OVER (ORDER BY datetime) AS prev_rfid, LAG(time_s) OVER (ORDER BY datetime) AS prev_time_s FROM landings) SELECT rfid, SUM(CASE WHEN prev_rfid IS NOT NULL AND prev_rfid <> rfid AND prev_time_s - time_s < 3 THEN 1 ELSE 0 END) AS score FROM domscore GROUP BY rfid;"
        // Execute the SQL query against the database
        console.log(req)
        const results = await db.query(query, [startDate, endDate]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                landings: results.rows,
            },
        });
    } catch(err) {
        console.log(err);
    }
    
});

// get a feeder's total visits from the scores table
app.get("/api/v1/scores/:fname", async (req, res) => {
    try{
        const results = await db.query("select count(*) as total from scores where fname = $1", [req.params.fname]);

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

// // get a feeder's visits from the last 30 days
// app.get("/api/v1/scores/:feeder", async (req, res) => {
//     const {param} = req.query;
//     try{
//         const results = await db.query("select count(*) as thirty from scores where feeder = $1 and date >= current_date - interval '30 days'", [req.params.feeder]);

//         res.status(200).json({
//             status: "success",
//             data: {
//                 scores: results.rows[0],
//             },
//         });
//     } catch(err) {
//         console.log(err);
//     }

// });

// // get a feeder's most frequent visitors
// app.get("/api/v1/scores/:feeder", async (req, res) => {
//     try{
//         const results = await db.query("select count(*) as most from scores where feeder = $1", [req.params.feeder]);

//         res.status(200).json({
//             status: "success",
//             data: {
//                 scores: results.rows[0],
//             },
//         });
//     } catch(err) {
//         console.log(err);
//     }

// });

// // get a feeder's least frequent visitors
// app.get("/api/v1/scores/:feeder", async (req, res) => {
//     try{
//         const results = await db.query("select count(*) as most from scores where feeder = $1", [req.params.feeder]);

//         res.status(200).json({
//             status: "success",
//             data: {
//                 scores: results.rows[0],
//             },
//         });
//     } catch(err) {
//         console.log(err);
//     }

// });


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});