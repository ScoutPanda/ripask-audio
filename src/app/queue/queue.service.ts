import { Injectable } from "@angular/core";
import {Song} from "../subsonic/subsonic.model";
import {shuffleArr} from "../helpers";

@Injectable({
  providedIn: "root"
})
export class QueueService {
  queue: Song[] = [];
  queueIndex = 0;

  setQueue(songs: Song[]): Song {
    this.queueIndex = 0;
    this.queue = [...songs];
    return this.queue[0];
  }

  shuffleQueue(): void {
    if (this.queue.length && this.queueIndex < this.queue.length) {
      this.queue = [...this.queue.splice(0, this.queueIndex + 1), ...shuffleArr(this.queue)];
    }
  }

  getNextSongFromQueue = (): Song | null => this.queueIndex <= this.queue.length ? this.queue[++this.queueIndex] : null;

  getPrevSongFromQueue = (): Song | null => this.queueIndex > 0 ? this.queue[--this.queueIndex] : null;
}
