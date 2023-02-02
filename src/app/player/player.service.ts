import { Injectable } from "@angular/core";
import {SubsonicService} from "../subsonic/subsonic.service";
import {QueueService} from "../queue/queue.service";
import {Title} from "@angular/platform-browser";
import {Song} from "../subsonic/subsonic.model";
import {shuffleArr} from "../helpers";

export enum Repeat {
  None = "0",
  All = "1",
  One = "2"
}

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private _player!: HTMLAudioElement;

  currentSong: Song | null = null;
  currentProgress = 0;
  private currentSongTimePlayed = 0;
  private previousPlayerTime = 0;
  private shuffle = false;
  private repeat = Repeat.None;
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
    this.repeat = this.initRepeat();
    this._player.volume = this.volume;
    this._player.ontimeupdate = () => {
      this.currentProgress = this._player.currentTime / this._player.duration;
      if (this._player.currentTime > this.previousPlayerTime) {
        this.currentSongTimePlayed += this._player.currentTime - this.previousPlayerTime;
      }
      this.previousPlayerTime = this._player.currentTime;
    }
  }

  initRepeat(): Repeat {
    const repeat = localStorage.getItem("repeat") || this.repeat;
    return (Object.values(Repeat) as string[]).includes(repeat) ? repeat as Repeat : this.repeat;
  }

  nextSong = () => {
    const song = this.repeat === Repeat.One ? this.currentSong : this.queueService.getNextSongFromQueue();
    if (song) {
      this.playSong(song);
    } else if (this.repeat === Repeat.All) {
      this.queueService.queueIndex = 0;
      this.playSong(this.queueService.queue[0]);
    } else {
      this._player.pause();
      this._player.currentTime = (this._player.duration - 0.1);
      this.doScrobble();
    }
  }

  previousSong() {
    const song = this.queueService.getPrevSongFromQueue();
    if (song) {
      this.playSong(song);
    } else {
      this._player.pause();
      this._player.currentTime = 0;
      this.doScrobble();
    }
  }

  playSong(song: Song) {
    this.doScrobble();
    this.currentSong = song;
    this.titleService.setTitle(`${song.title} - RipaskAudio`)
    this._player.src = song.songUrl;
    this._player.play().then();
  }

  private doScrobble(): void {
    if (this.currentSong && this.currentSongTimePlayed > (this.currentSong.duration / 1.3)) {
      this.subsonicService.scrobble(this.currentSong).subscribe();
    }
    this.currentSongTimePlayed = 0;
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

  playRandomSongs(genre = "") {
    this.subsonicService.getRandomSongs(genre).subscribe(res => this.playSongs(res));
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

  getRepeat(): Repeat {
    return this.repeat;
  }

  toggleRepeat() {
    if (this.repeat === Repeat.None) {
      this.repeat = Repeat.All;
    } else if (this.repeat === Repeat.All) {
      this.repeat = Repeat.One;
    } else {
      this.repeat = Repeat.None;
    }
    localStorage.setItem("repeat", this.repeat.toString());
  }

  setCurrentTime(val: number) {
    this._player.currentTime = val * this._player.duration;
    this.previousPlayerTime = this._player.currentTime;
    if (this._player.paused) {
      this._player.play().then();
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
