import React, {useState, createContext} from "react";

export const LandingsContext=  createContext();

export const LandingsContextProvider = props => {
    const [scores, setScores] = useState([])

    return (
        <LandingsContext.Provider value={{scores, setScores}}>
            {props.children}
        </LandingsContext.Provider>
    )
}