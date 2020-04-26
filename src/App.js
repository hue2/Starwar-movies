import React from 'react';
import './App.scss';
import Movie from './components/Movie/Movie';
import Filter from './components/Filter/Filter';
import './Common.scss';
import { MovieContextProvider } from './context/MovieContext';

function App() {
  return (
    <div className="App">
        <div className="nav">
          <img src={require("./assets/img/starwars-logo.png")} 
            className="logo" 
            alt="logo" />
        </div>
        <MovieContextProvider>
          <Filter />
          <Movie />
        </MovieContextProvider>
    </div>
  );
}

export default App;
