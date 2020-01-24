import React from 'react';
import logo from './logo.svg';
// import logo from './python-powered.svg';
import './App.css';
import { Store } from './Store';

function App() {
  // const store = React.useContext(Store);
  const { state, dispatch } = React.useContext(Store);
  
  const fetchDataAction = async () => {
    const data = await fetch('https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes');
    const dataJSON = await data.json();
    return dispatch({
      type: 'FETCH_DATA',
      payload: dataJSON._embedded.episodes
    });
  };
  
  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  return (
    <React.Fragment>
        {console.log(state)}
    <div className="App">
      <Header />
      <Body />
    </div>
    </React.Fragment>
  );
}

function Header() {
  const { state, dispatch } = React.useContext(Store);
  return (
    <header className="App-header Header">
      <img src={logo} className="App-logo" alt="logo" />
      <div>
      <h1 className="header">Rick & Morty</h1>
      <p>Pick Your Favorite Episodes</p>
      </div>
      <div className="favorites-count">
        <p>Favorite Count : {state.favorites.length}</p>
      </div>
    </header>

  )
}

function Body() {
  const { state, dispatch } = React.useContext(Store);
  const toggleFavAction = episode => {
    const episodeInFavorites = state.favorites.includes(episode);
    let dispatchObj = {
      type: 'ADD_FAV',
      payload: episode
    };
    if (episodeInFavorites) {
      const favoritesWithoutEpisode = state.favorites.filter(fav => fav.id !== episode.id)
      dispatchObj = {
        type: 'REMOVE_FAV',
        payload: favoritesWithoutEpisode
      };
    }
    return dispatch(dispatchObj);
  };
  return (
    <div>
      <section className="episode-layout">
          {state.episodes.map(episode => {
            return (
              <section className="episode-box" key={episode.id}>
                <img
                  src={episode.image.medium}
                  alt={`Rick and Morty ${episode.name}`}
                />
                <div>{episode.name}</div>
                <section>
                  <div className="section-season">
                    Season: {episode.season} Number: {episode.number}
                    <button type='button' onClick={() => toggleFavAction(episode)}>
                      {state.favorites.find(fav => fav.id === episode.id) ? 'Unfav' : 'Fav'}
                    </button>
                  </div>
                </section>
              </section>
            );
          })}
        </section>
    </div>
  )
}

export default App;
