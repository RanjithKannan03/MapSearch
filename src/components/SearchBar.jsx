import React, { useState } from "react";
import "./SearchBar.css";

import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'


function SearchBar({ placeholder, data, selected,clear , clearedSearch,enableDrive, disableDrive}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    // setInitial();
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.eventName.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search" >
      <div className="searchInputs" style={{ margin: '20px', padding: '20px', borderRadius:'10px' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
          onFocus={()=>{
            disableDrive();
          }}
          onBlur={()=>{
            // console.log("ye bitch begone")
            enableDrive();
          }}
          
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={()=>{
              clearInput();
              clearedSearch();
            }} />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult" style={{ margin: '20px', padding: '20px', borderRadius:'10px' }}>
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" onClick={()=>{
                // console.log("hi")
                // console.log(value.building)
                clear();
                selected(value.building)
                clearInput();
                clearedSearch();
              }}

              // onTouchStart={()=>{

              //   clear();
              //   selected(value.building)
              // }}
              
              >
                <p>{value.eventName} </p>
                <p>{value.description}</p>
                {/* <p>{value.building}</p> */}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;