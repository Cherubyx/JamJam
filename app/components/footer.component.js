import React from 'react';

export default class Footer extends React.Component {

  render() {
    return (
      <div className="footer">
        <p> Made with love using <img src="public/img/scotchio.png" className="scotchio" />
         & <img src="public/img/soundcloud.png" className="soundcloud"/>
        </p>
      </div>
    );
  }
}
