import React, { useState, useEffect } from 'react';


export default function Movies() {
    const [ movieList, setState ] = useState(null);
    const apiKey= `apikey=${process.env.REACT_APP_MOVIE_API_KEY}`;

    useEffect(() => {
        async function fetchMovieList() {
            try {
                let data = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?s=Star+Wars&${apiKey}`);
                let movieResponse = await data.json();  
                let movieList = await fetchMovieDetail(movieResponse.Search);    
                setState(movieList);
            }
            catch(err) {
                
                console.log(err);
            }
        }    
        fetchMovieList();
    }, []);
    
    async function fetchMovieDetail(allMovies) {
        try {
            return Promise.all(
                allMovies.map(async movie => { 
                    let movieDetail = await fetch(`${process.env.REACT_APP_MOVIE_BASE_URL}/?i=${movie.imdbID}&${apiKey}`);
                    let response = await movieDetail.json();
                    return { ...movie, Detail: response.Plot };
                })
            );
        }
        catch(err) {

        }
    }

    return (
        <div>
            {movieList && movieList.length > 0 && movieList.map(movie => 
                <>
                    <h2>Title</h2>
                    <p>{movie.Title}</p>
                    <h3>Detail</h3>
                    <p>{movie.Detail}</p>
                </>        
                )
            }
        </div>
    )
}