import React, {useState, createContext} from "react";

export const BirdsContext=  createContext();

export const BirdsContextProvider = props => {
    const [birds, setBirds] = useState([])

    return (
        <BirdsContext.Provider value={{birds, setBirds}}>
            {props.children}
        </BirdsContext.Provider>
    )
}