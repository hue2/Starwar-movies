import React, { useState, createContext, useEffect } from "react";

export const MovieContext = createContext();

//Store data among components
export const MovieContextProvider = props => {
    const [ originalMovieList, setData] = useState();
    const [ movieList, setMovies ] = useState();
    const [ decadeFilter, setFilter ] = useState();
    const apiKey= `apikey=${process.env.REACT_APP_MOVIE_API_KEY}`;

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            let movieResponse = await fetchMovies();  
            let movieList = await fetchMovieDetail(movieResponse.Search);
            let movieFilter = fetchDecadeFilter(movieList); 
            setData(movieList);
            setFilter(movieFilter);   
            setMovies(movieList);
        }
        catch(err) {
            
            console.log(err);
        }
    }    

    async function fetchMovies() {
        let data = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?s=Star+Wars&${apiKey}`);
        let movieResponse = await data.json();  
        return movieResponse
    }
    
    async function fetchMovieDetail(allMovies) {
        try {
            return Promise.all(
                allMovies.map(async movie => { 
                    let movieDetail = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?i=${movie.imdbID}&${apiKey}`);
                    let response = await movieDetail.json();
                    return { ...movie, Detail: response.Plot, Rated: response.Rated, Runtime: response.Runtime, Released: response.Released };
                })
            );
        }
        catch(err) {

        }
    }

    function fetchDecadeFilter(movieList) {
        let movieFilter = [];
        if (Array.isArray(movieList) && movieList.length > 0) {
            movieList.map(movie => {
                let decade = CalculateDecade(movie.Year);
                if (movieFilter.indexOf(decade) <= 0) {
                    movieFilter.push(decade);
                } 
            });
            movieFilter.sort();
        }
        return movieFilter;
    }

    function CalculateDecade(year) {
        return Math.floor(year / 10) * 10;
    }

    function filterMovies(year) {
        if (year === 0) {
            setMovies(originalMovieList);
        }
        else {
            let data = originalMovieList.filter(movie => CalculateDecade(movie.Year) === year);
            setMovies(data);
        }
    }   

    return (
        <MovieContext.Provider value={{ movie: [movieList], filter: [ decadeFilter, filterMovies] }}>
            {props.children}
        </MovieContext.Provider>
    )
}
