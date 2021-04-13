import { Injectable } from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {QueueService} from "../queue/queue.service";
import {Title} from "@angular/platform-browser";
import {Artist, ArtistList, Song} from "../subsonic/subsonic.model";
import {shuffleArr} from "../helpers";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // @ts-ignore
  private _player: HTMLAudioElement;

  currentSong: Song | null = null;
  currentProgress = 0;
  private shuffle = false;
  private repeat = false;
  private volume = 0.5;

  get playerVolume(): number {
    return this._player.volume;
  }

  set playerVolume(v: number) {
    this._player.volume = v;
    localStorage.setItem("volume", v.toString())
  }

  get paused(): boolean {
    return this._player.paused;
  }

  constructor(private subsonicService: SubsonicService,
              private queueService: QueueService,
              private titleService: Title) {}

  setPlayer(p: HTMLAudioElement) {
    this._player = p;
    this._player.onended = () => {
      this.nextSong();
    };
    if (localStorage.getItem("volume")) {
      const temp = parseFloat(localStorage.getItem("volume") || "");
      if (temp >= 0 && temp <= 1) {
        this.volume = temp;
      }
    }
    this.shuffle = (localStorage.getItem("shuffle") === "true") || this.shuffle;
    this.repeat = (localStorage.getItem("repeat") === "true") || this.repeat;
    this._player.volume = this.volume;
    this._player.ontimeupdate = () => {
      this.currentProgress = this._player.currentTime / this._player.duration;
    }
  }

  nextSong = () => {
    const song = this.queueService.getNextSongFromQueue();
    if (!song && this.repeat) {
      this.queueService.queueIndex = 0;
      this.playSong(this.queueService.queue[0]);
    } else {
      this.playSong(song);
    }
  }

  playSong(song: Song | null) {
    if (song) {
      this.currentSong = song;
      this.titleService.setTitle(`${song.title} - RipaskAudio`)
      this._player.src = song.songUrl;
      this._player.play();
    } else {
      this._player.pause();
    }
  }

  playSongInQueue(song: Song) {
    const index = this.queueService.queue.findIndex(s => s.id === song.id);
    if (index >= 0 && index !== this.queueService.queueIndex) {
      this.queueService.queueIndex = index;
      this.playSong(song);
    }
  }

  playSongs(songs: Song[]) {
    const firstSong = this.queueService.setQueue(this.shuffle ? shuffleArr(songs) : songs);
    this.playSong(firstSong);
  }

  playRandomSongs(genre: string = "") {
    this.subsonicService.getRandomSongs(genre).subscribe(res => this.playSongs(res));
  }

  previousSong() {
    this.playSong(this.queueService.getPrevSongFromQueue());
  }

  togglePaused() {
    this._player.paused ? this._player.play() : this._player.pause();
  }

  getShuffle(): boolean {
    return this.shuffle;
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    if (this.shuffle) {
      this.queueService.shuffleQueue();
    }
    localStorage.setItem("shuffle", this.shuffle.toString())
  }

  getRepeat(): boolean {
    return this.repeat;
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    localStorage.setItem("repeat", this.repeat.toString());
  }

  setCurrentTime(val: number) {
    this._player.currentTime = val * this._player.duration;
    if (this._player.paused) {
      this._player.play();
    }
  }

  songLoaded(): boolean {
    return !!this._player.src;
  }

  playAlbum(id: string) {
    this.subsonicService.getAlbum(id).subscribe(res => {
      const songs = this.subsonicService.getAlbumAndSongs(res).songs;
      this.playSongs(songs);
    });
  }

  playArtist(id: string) {
    this.subsonicService.getSongsByArtist(id).subscribe(res => this.playSongs(res));
  }
}
