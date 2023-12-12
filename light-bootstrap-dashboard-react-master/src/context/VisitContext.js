import React, {useState, createContext} from "react";

export const VisitContext = createContext();

export const VisitContextProvider = props => {
    const [visits, setVisits] = useState([])

    return (
        <VisitContext.Provider value={{visits, setVisits}}>
            {props.children}
        </VisitContext.Provider>
    )
}