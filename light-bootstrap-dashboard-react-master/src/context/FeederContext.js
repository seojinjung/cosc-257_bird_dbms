import React, {useState, createContext} from "react";

export const FeederContext = createContext();

export const FeederContextProvider = props => {
    const [feeders, setFeeders] = useState([])

    return (
        <FeederContext.Provider value={{feeders, setFeeders}}>
            {props.children}
        </FeederContext.Provider>
    )
}