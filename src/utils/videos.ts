import * as Firebase from './firebase';

export interface VideoNode {
  name: string;
  disabled?: boolean;
  startSeconds: number;
  endSeconds: number;
  fadeIn?: number;
  fadeOut?: number;
  lastPlayed?: number;
}

export type Video = Firebase.Entity<VideoNode>;

const RECENT_VIDEOS_TO_EXCLUDE = 5;

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export async function loadVideos() {
  return getCurrentVideo();
}

export function getVideoUrl(video: Video) {
  return `https://www.youtube.com/watch?v=${video.id}`;
}

export async function getCurrentVideo() {
  const videosNode = await Firebase.fetchValue<Firebase.MapNode<VideoNode>>('videos');
  const videos = Firebase.toList(videosNode).sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0)).filter(video => !video.disabled);

  if (videos.length === 0) {
    return null;
  }

  const mostRecentVideo = videos[0];

  if (mostRecentVideo.lastPlayed && mostRecentVideo.lastPlayed >= getStartOfToday()) {
    return mostRecentVideo;
  }

  const potentialVideos = videos.slice(Math.min(RECENT_VIDEOS_TO_EXCLUDE, videos.length - 1));
  const videoIndex = Math.floor(Math.random() * potentialVideos.length);
  const todaysVideo = potentialVideos[videoIndex];

  Firebase.app.database().ref(`videos/${todaysVideo.id}/lastPlayed`).set(Firebase.getTimestamp());

  return todaysVideo;
}
