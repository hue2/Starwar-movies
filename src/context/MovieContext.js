import React, { useState, createContext, useEffect } from "react";

export const MovieContext = createContext();

//Central data store among components
export const MovieContextProvider = props => {

    //originalMovieList is for restoring to the original list when the 'All' filter is clicked
    const [ originalMovieList, setOriginalList] = useState();
    const [ loading, setLoading] = useState(true);
    const [ movieList, setMovies ] = useState();
    const [ decadeFilter, setFilter ] = useState();

    useEffect(() => {
        const apiKey= `apikey=${process.env.REACT_APP_MOVIE_API_KEY}`;

        async function fetchData() {
            try {
                setLoading(true);
                let movieResponse = await fetchMovies();  
                let movies = await fetchMovieDetail(movieResponse.Search);
                
                //sort the movie list by year in descending order
                movies.sort((a, b) => b.Year - a.Year);
                let movieFilter = getDecadeFilter(movies); 

                setOriginalList(movies);
                setFilter(movieFilter);   
                setMovies(movies);
                setLoading(false);
            }
            catch(err) {      
                console.log(err);
            }
        }

        async function fetchMovies() {
            let data = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?s=Star+Wars&${apiKey}`);
            return await data.json()
        }
        
        async function fetchMovieDetail(movies) {
            try {
                return Promise.all(
                    movies.map(async movie => { 
                        let movieDetail = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?i=${movie.imdbID}&${apiKey}`);
                        let response = await movieDetail.json();
                        return { ...movie, 
                            Detail: response.Plot, 
                            Rated: response.Rated, 
                            Runtime: response.Runtime, 
                            Released: response.Released 
                        };
                    })
                );
            }
            catch(err) {
                console.log(err);
            }
        }
    
        //Get the list of decades for filter
        function getDecadeFilter(movies) {
            let movieFilter = [];
            if (Array.isArray(movies) && movies.length > 0) {
                for (const movie of movies) {
                    let decade = calculateDecade(movie.Year);
                    if (movieFilter.indexOf(decade) === -1) {
                        movieFilter.push(decade);
                    } 
                }
                movieFilter.sort().reverse();
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
        //Restore the list if the year is 0 ("All" filter option) 
        if (year === 0) {
            setMovies(originalMovieList);
        }
        else {
            let data = originalMovieList.filter(movie => calculateDecade(movie.Year) === year);
            setMovies(data);
        }
    }   

    return (
        <MovieContext.Provider value={{ movie: [movieList], filter: [ decadeFilter, filterMovies], loading }}>
            {props.children}
        </MovieContext.Provider>
    )
}
