import React, { useContext  } from 'react';
import { MovieContext } from '../../context/MovieContext';
import './Movie.scss';

export default function Movie() {
    const { movie }= useContext(MovieContext);
    const [ movieList ] = movie;

    return (
        <>
            <div className="flex-row">
                {Array.isArray(movieList) && movieList.length > 0 ? movieList.map(movie => 
                    <div key={movie.imdbID} className="container">
                        <div>
                            <img className="img-style" src={require(`../../assets/img/${movie.imdbID}.jpg`)} alt={movie.Poster}></img>
                        </div>
                        <div className="m-left-15 txt-align-left">
                            <h3>{movie.Title}</h3>
                            <hr className="gray-line" />
                            <div className="display-flex">
                                <div className="rate-container">{movie.Rated}</div>
                                <div className="runtime-container">{movie.Runtime}</div>
                                <div className="release-container">{movie.Released}</div>
                            </div>
                            <p>{movie.Detail}</p>
                            <div>
                                <a href={`https://www.imdb.com/title/${movie.imdbID}`} className="view-link" target="_blank" rel="noopener noreferrer">View on IMDB</a>
                            </div>
                        </div>
                    </div>)  
                    :
                    <div>
                        <h4>No movie was found</h4>
                    </div>      
                }
            </div>
        </>
    )
}