"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

const Page = () => {
  const [apiResponse, setAPIResponse] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [sortBy, setSortBy] = useState('');
 
  const apiCall = async () => {
    try {
      const res = await axios.get("https://randomuser.me/api/?results=20");
      const newData = res.data.results;
      setAPIResponse(newData);
      setFilteredList(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.trim().toLowerCase();
    setSearchKeyword(term);
    
    if (!term) {
      setFilteredList(apiResponse);
      return;
    }
  
    function searchInObject(obj, term) {
      for (const key in obj) {
          if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(term)) {
              return true;
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              if (searchInObject(obj[key], term)) {
                  return true; 
              }
          }
      }
      return false;
    }
  
    const filteredLists = apiResponse.filter(item => searchInObject(item, term.toLowerCase()));
    setFilteredList(filteredLists);
  };

  const handleSort = (e) => {
    const selectedSortBy = e.target.value;
    setSortBy(selectedSortBy);
    let sortedList = [...filteredList];
    if (selectedSortBy === 'clear') {
      setSortBy('');
      return;
    }


    sortedList.sort((a, b) => {
      const aValue = getProperty(a, selectedSortBy);
      const bValue = getProperty(b, selectedSortBy);
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
    setFilteredList(sortedList);
  };
  const getProperty = (object, path) => {
    const properties = path.split('.');
    return properties.reduce((obj, prop) => {
      return obj && obj[prop] !== undefined ? obj[prop] : null;
    }, object);
  };

  useEffect(() => {
    apiCall();
  }, []);

  return (
    <div className="pl-20 pt-10">
      <div className="flex flex-row">
        <input
          type="input"
          onChange={handleSearch}
          placeholder="Enter"
          className="mb-4 outline-gray-700 border pl-2"
        />
        <div>
          Sort By: 
          <select onChange={handleSort} value={sortBy} className="ml-2 outline-gray-700 border pl-1 pr-1">
            <option value="">--Select--</option>
            <option value="name.first">First Name</option>
            <option value="location.city">City</option>
            <option value="location.state">State</option>
            <option value="location.country">Country</option>
            <option value="clear">Clear</option>
          </select>
        </div>
      </div>
      {filteredList.map((item, index) => (
        <div className="flex gap-4 pb-2" key={item.id?.value || index}>
          <Image
            src={item.picture.thumbnail}
            alt="user image"
            height={20}
            width={20}
            className="rounded-full"
          />
          <p>{item.name.first}</p>
          <p>{item.name.last}</p>
          <p>{item.location.city}</p>
          <p>{item.location.state}</p>
          <p>{item.location.country}</p>
          <p>{item.location.postcode}</p>
          <p>{item.email}</p>
          <p>{item.dob.age}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
