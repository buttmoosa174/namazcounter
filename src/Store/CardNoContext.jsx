import React, { createContext, useState, useContext } from 'react';

const CardNoContext = createContext();

export const useCardNo = () => useContext(CardNoContext);

export const CardNoProvider = ({ children }) => {

  const [ cardNo, setCardNo ]       = useState("");
  const [ username, setUsername ]   = useState("");
  const [ depName, setDepName ]     = useState(""); 
  const [ UserPic, setUserPic ]     = useState("");
  const [ deptId, setDepId    ]     = useState("");
  const [ loading, setLoading ]     = useState(false);

 
  return (
    <CardNoContext.Provider value={ { cardNo, setCardNo, username, setUsername, depName, setDepName, UserPic, setUserPic, deptId, setDepId, loading, setLoading } }>
      { children }
    </CardNoContext.Provider>
  );
};

