import React, {useState, createContext} from "react";

export const ScoreContext = createContext();

export const ScoreContextProvider = props => {
    const [scores, setScores] = useState([])

    return (
        <ScoreContext.Provider value={{scores, setScores}}>
            {props.children}
        </ScoreContext.Provider>
    )
}