import React, { useContext, useState } from 'react';
import { MovieContext } from '../../context/MovieContext';
import "./Filter.scss";

export default function Filter() {
    const [ activeIdBtn, setActive ] = useState(0);
    const { filter } = useContext(MovieContext);
    const [ decadeFilter, filterMovies ] = filter;

    const changeDecade = (year) => {
        setActive(year);
        filterMovies(year);
    }   

    return (
        <div className="filter-container">
            <button key="0" className={`filter-btn ${activeIdBtn == 0 ? "active" : ""}`} onClick={() => changeDecade(0)}>All</button>
            {
                Array.isArray(decadeFilter) && decadeFilter.length 
                    && decadeFilter.map(filter => 
                    <button key={filter} id={filter} className={`filter-btn ${activeIdBtn == filter ? "active" : ""}`} onClick={() => changeDecade(filter)}>{filter}'s</button>
                )
            }
        </div>
    )
}