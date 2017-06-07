import * as firebase from 'firebase';
import firebaseConfig from '../../config/firebase.config';
export const app = firebase.initializeApp(firebaseConfig);
import * as Videos from './videos';

export async function fetchValue<T>(path: string): Promise<T | null> {
  const response = await app.database().ref(path).once('value');
  return response.val();
}

export function getValue(obj: {[key: string]: any}, path: string) {
  const value = path.split('/').filter(p => !!p).reduce((acc, key) => {
    return acc && acc[key];
  }, obj);
  return typeof value === 'undefined' ? null : value;
}

export function getTimestamp() {
  return firebase.database.ServerValue.TIMESTAMP;
}

export type Entity<T> = T & { id: string };

export function toList<T>(node: MapNode<T> | null | undefined): Entity<T>[] {
  const mapNode = node || {};
  return Object.keys(mapNode).map((id) => Object.assign({ id }, mapNode[id]));
}

export interface MapNode<T> {
  [key: string]: T;
}

export interface Database {
  videos: MapNode<Videos.VideoNode>;
}
