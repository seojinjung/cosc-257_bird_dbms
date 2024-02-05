import axios from "axios";

export default axios.create({
    baseURL: "http://cosc-257-node06.cs.amherst.edu:3000/api/v1/scores"
}); 