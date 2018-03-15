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

        this.setState({ video });
      }
    });
  }

  onStart = () => {
    if (!this.state.video) {
      return;
    }

    let { fadeIn, fadeOut, startSeconds, endSeconds } = this.state.video;
    let startDelay = (startSeconds - Math.floor(startSeconds)) * 1000;
    startSeconds = Math.floor(startSeconds);

    if (fadeIn) {
      setTimeout(() => this.fade(true, fadeIn as number), startDelay);
    }

    if (fadeOut) {
      const playTime = (endSeconds - startSeconds) * 1000;
      setTimeout(() => this.fade(false, fadeOut as number), playTime - fadeOut * 1000);
    }

    const volume = (fadeIn || startDelay > 0) ? 0 : maxVolume;
    this.setState({ volume });

    if (startDelay && !fadeIn) {
      setTimeout(() => this.setState({ volume: maxVolume }), startDelay);
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
      config: {
        youtube: {
          playerVars: {
            start: Math.floor(video.startSeconds),
            end: video.endSeconds
          },
          preload: false
        }
      },
      onStart: this.onStart
    };

    return <ReactPlayer {...playerProps} />
  }
}
