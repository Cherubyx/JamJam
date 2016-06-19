import React from 'react';
import ReactDOM from 'react-dom';

// Import components
import AppContainer from './containers/app.container'

// Search component as a class
class App extends React.Component {
  // Render returns JSX template
  render() {
    return (
      <AppContainer />
    );
  }
}
  // Render to ID content in the DOM
  ReactDOM.render(
    < App / >,
    document.getElementById('content')
  );
