import * as React from 'react';
import * as Videos from './utils/videos';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

import './App.scss';

interface AppState {
  video: Videos.Video | null;
  volume: number;
}

const maxVolume = 0.8;

export default class App extends React.PureComponent<{}, AppState> {
  state: AppState = { video: null, volume: maxVolume };

  componentDidMount() {
    Videos.loadVideos().then((video) => {
      if (video) {
        try {
          document.title = video.name;
        } catch (e) { }

        this.setState({ video, volume: video.fadeIn ? 0 : maxVolume });
      }
    });
  }

  onStart = () => {
    const video = this.state.video as Videos.Video;
    const { fadeIn, fadeOut } = video;

    if (fadeIn) {
      this.fade(true, fadeIn);
    }

    if (fadeOut) {
      const playTime = (video.endSeconds - video.startSeconds) * 1000;
      setTimeout(() => this.fade(false, fadeOut), playTime - fadeOut * 1000);
    }
  }

  fade = (fadeIn: boolean, fadeSeconds: number) => {
    let currentStep = 0;
    const numSteps = 10;
    const stepTime = fadeSeconds * 1000 / numSteps;

    const fadeStep = () => {
      currentStep++;

      const percentDone = currentStep / numSteps;
      const newVolume = (fadeIn ? percentDone : 1 - percentDone) * maxVolume;

      this.setState({ volume: newVolume });

      if (currentStep < numSteps) {
        setTimeout(fadeStep, stepTime);
      }
    };

    fadeStep();
  }

  render() {
    const video = this.state.video;

    if (!video) {
      return <div>Loading...</div>;
    }

    console.log(this.state.volume)

    const playerProps: ReactPlayerProps = {
      playing: true,
      controls: true,
      url: Videos.getVideoUrl(video),
      volume: this.state.volume,
      height: window.innerHeight - 16,
      width: window.innerWidth,
      youtubeConfig: {
        playerVars: {
          start: video.startSeconds,
          end: video.endSeconds
        },
        preload: false
      },
      onStart: this.onStart
    };

    return <ReactPlayer {...playerProps} />
  }
}
