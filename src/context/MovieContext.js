import React, { useState, createContext, useEffect } from "react";

export const MovieContext = createContext();

//Central data store among components
export const MovieContextProvider = props => {
    //storing original list for the 'All' filter
    const [ originalMovieList, setOriginalList] = useState();
    const [ movieList, setMovies ] = useState();
    const [ decadeFilter, setFilter ] = useState();

    useEffect(() => {
        const apiKey= `apikey=${process.env.REACT_APP_MOVIE_API_KEY}`;

        async function fetchData() {
            try {
                let movieResponse = await fetchMovies();  
                let movieList = await fetchMovieDetail(movieResponse.Search);
                
                //sort the movie list by year
                movieList.sort((a, b) => a.Year - b.Year);

                let movieFilter = getDecadeFilter(movieList); 
                setOriginalList(movieList);
                setFilter(movieFilter);   
                setMovies(movieList);
            }
            catch(err) {      
                console.log(err);
            }
        }

        async function fetchMovies() {
            let data = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?s=Star+Wars&${apiKey}`);
            return await data.json()
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
                console.log(err);
            }
        }
    
        //Get the list of decades for filter
        function getDecadeFilter(movieList) {
            let movieFilter = [];
            if (Array.isArray(movieList) && movieList.length > 0) {
                for (const movie of movieList) {
                    let decade = calculateDecade(movie.Year);
                    if (movieFilter.indexOf(decade) <= 0) {
                        movieFilter.push(decade);
                    } 
                }
                movieFilter.sort();
            }
            return movieFilter;
        }

        fetchData();    
    }, []);

    //Calculate the decade that the year belongs to
    function calculateDecade(year) {
        return Math.floor(year / 10) * 10;
    }

    function filterMovies(year) {
        if (year === 0) {
            setMovies(originalMovieList);
        }
        else {
            let data = originalMovieList.filter(movie => calculateDecade(movie.Year) === year);
            setMovies(data);
        }
    }   

    return (
        <MovieContext.Provider value={{ movie: [movieList], filter: [ decadeFilter, filterMovies] }}>
            {props.children}
        </MovieContext.Provider>
    )
}
