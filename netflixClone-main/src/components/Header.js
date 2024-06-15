import React, { useEffect } from "react";
import axios from 'axios';
import './Header.css';

const Header = ({ black }) => {
  useEffect(() => {
    fetchConfig('FREE'); // Fetch config for FREE subscription by default
  }, []);

  const fetchConfig = async (subscriptionType) => {
    try {
      const response = await axios.post('https://scale-server.onrender.com/user/get-mapping', {
        filter: { COUNTRY: 'IN', SUBSCRIPTION: subscriptionType },
        projectID: 'vishal_72d8f604-cb87-4358-8dc8-1d53a96670c9'
      });

      const appConfig = response.data.mappings.appConfig;
      console.log('Fetched appConfig:', appConfig);

      // Update localStorage with appConfig
      localStorage.setItem('appConfig', JSON.stringify(appConfig));
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  // Fetch appConfig from localStorage
  const appConfig = JSON.parse(localStorage.getItem('appConfig'));

  return (
    <header className={black ? 'black' : ''}>
      <div className="header--logo">
        {appConfig && appConfig.HeaderLogo && (
          <a href="/">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png" alt="Netflix Logo" />
          </a>
        )}
      </div>
      <div className="header--user">
        {appConfig && appConfig.HeaderUser && (
          <a href="/">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User Avatar" />
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
