import React from 'react';

const Footer = ({poll, onPollSelect}) => {

  //const imageUrl = video.snippet.thumbnails.default.url;

  return (
    <footer className="footer fixed-bottom">
      <div className="container">
        <p className="text-muted text-center">Copyright Stephen Armstrong 2017. All rights reserved. This site uses cookies.</p>
      </div>
    </footer>
  );
};

export default Footer;
