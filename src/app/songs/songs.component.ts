import {Component, OnInit} from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {PlayerService} from "../player/player.service";
import {Song} from "../subsonic/subsonic.model";
import {QueueService} from "../queue/queue.service";

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];
  displayedColumns: string[] = ["img", "title"];

  constructor(
    private subsonicService: SubsonicService,
    private playerService: PlayerService,
    private queueService: QueueService
  ) { }

  ngOnInit(): void {
    this.subsonicService.getRandomSongs().subscribe(res => {
      this.songs = res;
    })
  }

  play(song: Song) {
    this.queueService.setQueue([song]);
    this.playerService.playSong(song);
  }

  addAllToQueue() {
    this.queueService.setQueue(this.songs);
    this.playerService.playSong(this.songs[0]);
  }
}
