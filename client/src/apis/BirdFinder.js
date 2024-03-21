import axios from "axios";

const BirdFinder = axios.create({
    baseURL: "http://localhost:3006/api/v1/birds"
});

BirdFinder.fetchBirds = async (startDate, endDate) => {
    try {
        const response = await BirdFinder.get("/", {
            params: {
                start: startDate,
                end: endDate,
                query: "SELECT * FROM birds WHERE rfid IN (SELECT rfid FROM captures WHERE cdate BETWEEN ? AND ?) ORDER BY cast(dom_score as int) DESC"
            }
        });

        console.log("In the API Call: ", response.data.data.birds);
        return response.data.data.birds;
    } catch (error) {
        console.error('Error fetching birds:', error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

export default BirdFinder;

