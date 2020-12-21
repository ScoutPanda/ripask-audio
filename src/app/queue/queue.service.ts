import { Injectable } from '@angular/core';
import {Song} from "../subsonic/subsonic.model";
import {shuffleArr} from "../helpers";

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  queue: Song[] = [];
  queueIndex = 0;

  addSongToQueue(song: Song) {
    this.queue.push(song);
  }

  setQueue(songs: Song[]): Song {
    this.queueIndex = 0;
    this.queue = [...songs];
    return this.queue[0];
  }

  removeSongFromQueue(song: Song) {
    const index = this.queue.findIndex(v => v.id === song.id);
    this.queue.splice(index, 1);
  }

  shuffleQueue() {
    if (this.queue.length && this.queueIndex < this.queue.length) {
      this.queue = [...this.queue.splice(0, this.queueIndex + 1), ...shuffleArr(this.queue)];
    }
  }

  getNextSongFromQueue = (): Song | null => this.queueIndex <= this.queue.length ? this.queue[++this.queueIndex] : null;

  getPrevSongFromQueue = (): Song | null => this.queueIndex > 0 ? this.queue[--this.queueIndex] : null;
}
