import * as Firebase from './firebase';

export interface VideoNode {
  name: string;
  startSeconds: number;
  endSeconds: number;
  fadeIn?: number;
  fadeOut?: number;
  lastPlayed?: number;
}

export type Video = Firebase.Entity<VideoNode>;

const RECENT_VIDEOS_TO_EXCLUDE = 5;
// const MAX_VOLUME = 70;

function isToday(time: number) {
  const now = new Date();
  const date = new Date(time);
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

export async function loadVideos() {
  // await initYoutube();
  return getCurrentVideo();

}

export function getVideoUrl(video: Video) {
  return `https://www.youtube.com/watch?v=${video.id}`;
}

// async function initYoutube() {
//   return new Promise((resolve) => {
//     (window as any).onYouTubeIframeAPIReady = () => resolve();

//     const tag = document.createElement('script');
//     tag.src = "https://www.youtube.com/iframe_api";

//     const firstScriptTag = document.getElementsByTagName('script')[0];
//     if (firstScriptTag.parentNode) {
//       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     }
//   });
// }

export async function getCurrentVideo() {
  const videosNode = await Firebase.fetchValue<Firebase.MapNode<VideoNode>>('videos');
  const videos = Firebase.toList(videosNode).sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));

  if (videos.length === 0) {
    return null;
  }

  const mostRecentVideo = videos[0];

  if (mostRecentVideo.lastPlayed && isToday(mostRecentVideo.lastPlayed)) {
    return mostRecentVideo;
  }

  const potentialVideos = videos.slice(Math.min(RECENT_VIDEOS_TO_EXCLUDE, videos.length - 1));
  const videoIndex = Math.floor(Math.random() * potentialVideos.length);
  const todaysVideo = potentialVideos[videoIndex];

  Firebase.app.database().ref(`videos/${todaysVideo.id}/lastPlayed`).set(Firebase.getTimestamp());

  return todaysVideo;
}

// export function fade(player, fadeIn, fadeSeconds) {
//   let currentStep = 0;
//   const numSteps = 10;
//   const stepTime = fadeSeconds * 1000 / numSteps;

//   const fadeStep = () => {
//     currentStep++;

//     const percentDone = Math.floor(currentStep / numSteps * 100);
//     const newVolume = fadeIn ? percentDone : 100 - percentDone;

//     player.setVolume(Math.floor(newVolume * (MAX_VOLUME / 100)));

//     if (currentStep < numSteps) {
//       setTimeout(fadeStep, stepTime);
//     }
//   };

//   fadeStep();
// }
