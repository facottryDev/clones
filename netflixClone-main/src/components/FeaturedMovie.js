import React from "react";
import axios from 'axios';
import "./FeaturedMovie.css";
import { FaPlay, FaPlus } from "react-icons/fa";

class FeaturedMovie extends React.Component {
  constructor(props) {
    super(props);
    // Initialize mode state with the value from localStorage or false if not set
    this.state = {
      config: null,
      mode: localStorage.getItem('mode') === 'true'  // Convert stored string to boolean
    };
  }

  componentDidMount() {
    this.getConfig('FREE'); // Fetch config for FREE subscription by default
  }

  getConfig = async (subscriptionType) => {
    try {
      const response = await axios.post('https://scale-server.onrender.com/user/get-mapping', {
        filter: { COUNTRY: 'IN', SUBSCRIPTION: subscriptionType },
        projectID: 'vishal_72d8f604-cb87-4358-8dc8-1d53a96670c9'
      });
      console.log('Full API response:', response.data); // Log the full response
      console.log('Fetched config:', response.data.mappings); // Debug logging
      this.setState({ config: response.data.mappings }); // Store mappings in state
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  toggleMode = () => {
    const newMode = !this.state.mode;
    this.setState({ mode: newMode });
    localStorage.setItem('mode', newMode); // Store mode in localStorage
  };

  render() {
    const { item } = this.props;
    const { config, mode } = this.state;

    if (!config) return <div>Loading...</div>;

    console.log('Current config:', config); // Log current config to debug

    let firstDate = new Date(item.first_air_date);
    let genres = item.genres.map(genre => genre.name);

    return (
      <section className="featured"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: (mode || config.appConfig.featuredBackground) ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : "none",
        }}>
        <div className="featured--vertical">
          <div className="featured--horizontal">
            {(mode || config.appConfig.featuredName) && (
              <div className="featured--name">{item.original_name}</div>
            )}
            <div className="featured--info">
              {(mode || config.appConfig.featuredYear) && (
                <div className="featured--year">{firstDate.getFullYear()}</div>
              )}
              {(mode || config.appConfig.featuredPoints) && (
              <div className="featured--points">{item.vote_average} pontos</div>
              )}
              {(mode || config.appConfig.featuredSeasons) && (
                <div className="featured--seasons">
                  {item.number_of_seasons} temporada{item.number_of_seasons !== 1 ? "s" : ""}
                </div>
              )}
            </div>
            {(mode || config.appConfig.featuredDescription) && (
              <div className="featured--description">{item.overview}</div>
            )}
            {(mode || config.appConfig.featuredButtons) && (
              <div className="featured--buttons">
                <a href={`/watch/${item.id}`} className="featured--watchbutton">
                  <FaPlay size={13} /> Assistir
                </a>
                {(!mode && config.appConfig.featuredMyListButton) && (
                  <a href={`/list/add/${item.id}`} className="featured--mylistbutton">
                    <FaPlus size={13} /> My list
                  </a>
                )}
              </div>
            )}
            {(mode || config.appConfig.featuredGenres) && (
              <div className="featured--genres">
                <strong>Gêneros:</strong> {genres.join(", ")}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default FeaturedMovie;
