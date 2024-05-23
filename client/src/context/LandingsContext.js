import React, {useState, createContext} from "react";

export const LandingsContext=  createContext();

export const LandingsContextProvider = props => {
    const [landings, setLandings] = useState([])

    return (
        <LandingsContext.Provider value={{landings, setLandings}}>
            {props.children}
        </LandingsContext.Provider>
    )
}