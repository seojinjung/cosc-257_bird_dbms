import axios from "axios";

const LandingsFinder = axios.create({
    baseURL: "http://localhost:3006/api/v1/landings"
});

LandingsFinder.fetchLandings = async (startDate, endDate) => {
    try {
        const response = await LandingsFinder.get("/", {
            params: {
                query: "WITH domscore AS (SELECT rfid, feeder, time_s, datetime, LAG(rfid) OVER (ORDER BY datetime) AS prev_rfid, LAG(time_s) OVER (ORDER BY datetime) AS prev_time_s FROM landings) SELECT rfid, SUM(CASE WHEN prev_rfid IS NOT NULL AND prev_rfid <> rfid AND prev_time_s - time_s < 3 THEN 1 ELSE 0 END) AS score FROM domscore GROUP BY rfid;"
            }
        });

        console.log("In the API Call: ", response.data.data.feeders);
        return response.data.data.feeders;
    } catch (error) {
        console.error('Error fetching scores:', error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

export default LandingsFinder;