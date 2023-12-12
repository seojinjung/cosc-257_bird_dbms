import React, {useState, createContext} from "react";

export const CapturesContext = createContext();

export const CapturesContextProvider = props => {
    const [captures, setCaptures] = useState([])

    return (
        <CapturesContext.Provider value={{captures, setCaptures}}>
            {props.children}
        </CapturesContext.Provider>
    )
}