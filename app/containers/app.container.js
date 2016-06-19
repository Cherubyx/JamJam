import React from 'react';

// Connects to soundcloud to fetch music
import Axios from 'axios';

// Sound component
import Sound from 'react-sound';

// Custom components
import Search from '../components/search.component';
import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {

  constructor(props) {
    super (props);

    // Set client_id
    this.client_id = '0bb7ab99dc485da3463b9ddf4c554421';

    this.state = {
      // Whatever returned, we only need these 3 properties for our app
      track: {stream_url: '', title: '', artwork_url: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      playFromPosition: 0,
      autoCompleteValue: '',
      index: 0,
      tracks: [],
      previousTrack: {stream_url: '', title: '', artwork_url: ''},
      nextTrack: {stream_url: '', title: '', artwork_url: ''}
    };
  }

  render () {
    const jamjam = {
      width: '500px',
      height: '500px',
      backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0.7)
      ), url(${this.xlArtwork(this.state.track.artwork_url)})`
    }
    return (
      <div className="jamjammusic" style={jamjam}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}
        />
        <Details
          title={this.state.track.title}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.randomTrack.bind(this)}
        />
        <Sound
          url={this.prepareUrl(this.state.track.stream_url)}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          onFinishedPlaying={this.handleSongFinished.bind(this)}
         />
         <Progress
          elapsed={this.state.elapsed}
          position={this.state.position}
          total={this.state.total}
         />
         <Footer />
      </div>
    );
  }

  // Lifecycle method - called once component is loaded
  componentDidMount () {
    this.randomTrack();
  }

  // Make the url image larger
  xlArtwork(url) {
    return url.replace(/large/, 't500x500');
  }

  // Toggle play of music
  togglePlay () {
    if (this.state.playStatus === Sound.status.PLAYING) {
      this.setState({playStatus: Sound.status.PAUSED});
    } else {
      this.setState({playStatus: Sound.status.PLAYING});
    }
  }

  stop() {
    this.setState({playStatus: Sound.status.STOPPED});
  }

  forward() {
    // if (this.state.nextTrack === undefined || this.state.nextTrack === null) {
    //   this.randomTrack();
    // } else {
    //   this.setState({
    //     previousTrack: this.state.track,
    //     track: this.state.nextTrack,
    //     nextTrack: null
    //   });
    // }
    const nextIndex = this.state.index + 1;

    if (this.state.tracks.length !== nextIndex){
      this.setState({
        track: this.state.tracks[nextIndex],
        index: nextIndex
      });
    }
  }

  backward() {
    // if (this.state.previousTrack === null || this.state.previousTrack === undefined) {
    //   this.randomTrack();
    // } else {
    //   this.setState({
    //     nextTrack: this.state.track,
    //     track: this.state.previousTrack,
    //     previousTrack: null
    //   });
    // }

    const prevIndex = this.state.index - 1;
    if (prevIndex > -1) {
      this.setState({
        track: this.state.tracks[prevIndex],
        index: prevIndex
      });
    }
  }

  // Randomize a track from soundcloud
  randomTrack() {
    let _this = this;

    // Request a music playlist from SoundCloud using a client id
    Axios.get (`https://api.soundcloud.com/playlists/70087845?client_id=${this.client_id}`)
      .then (function (response) {
        // Store length of tracks
        const trackLength = response.data.tracks.length;

        // Random number
        const random = Math.floor((Math.random() * trackLength));

        // Set current track if exist to previousTrack
        if (_this.state !== undefined) {
          _this.setState({previousTrack: _this.state.track});
        }

        // Set track state
        _this.setState ({
          track: response.data.tracks[random],
          index: random,
          tracks: response.data.tracks
        });
      })
      .catch(function (error){
        // Log error
        console.log(error);
      });
  }

  // Attach client id to the url
  prepareUrl(url) {
    return `${url}?client_id=${this.client_id}`;
  }

  // Handle behaviour during sound PLAYING
  handleSongPlaying (audio) {
    this.setState({
      elapsed: this.formatMilliseconds (audio.position),
      total: this.formatMilliseconds (audio.duration),
      position: audio.position / audio.duration
    });
  }

  // Handle behaviour when song is complete
  handleSongFinished (audio) {
    this.randomTrack();
  }

  // Handle behaviour on search selected
  handleSelect (value, item) {
    this.setState ({autoCompleteValue: value, track: item});
  }

  // Handle behaviour on search changed
  handleChange (value, item) {
    // Update input box
    this.setState({autoCompleteValue: event.target.value});
    let _this = this;

    // Search song with entered value
    Axios.get(`https://api.soundcloud.com/tracks?client_id=${this.client_id}&q=${value}`)
      .then (function (response) {
        // Update track state
        _this.setState({tracks: response.data});
      })
      .catch(function (error){
        console.log(error);
      });
  }

  // Format time
  formatMilliseconds (milliseconds) {
    // Hours
    var hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;

    // Minutes
    var minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;

    // Seconds
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;

    // Return as string
    return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

}

export default AppContainer
