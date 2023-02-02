import {Component, Input, OnInit} from "@angular/core";
import {SubsonicService} from "../subsonic/subsonic.service";
import {PlayerService} from "../player/player.service";
import {Song} from "../subsonic/subsonic.model";
import {QueueService} from "../queue/queue.service";
import {shuffleArr} from "../helpers";

@Component({
  selector: "app-song-list",
  templateUrl: "./song-list.component.html",
  styleUrls: ["./song-list.component.scss"]
})
export class SongListComponent implements OnInit {
  @Input() songs: Song[] = [];
  @Input() queue = false;
  @Input() hideAlbum = false;
  displayedColumns: string[] = ["track", "title", "length", "artist"];

  constructor(
    private subsonicService: SubsonicService,
    public playerService: PlayerService,
    private queueService: QueueService
  ) {
  }

  ngOnInit(): void {
    if (!this.hideAlbum) {
      this.displayedColumns.push("album");
    }
  }

  play(song: Song): void {
    if (this.queue) {
      this.playerService.playSongInQueue(song);
    } else {
      if (this.playerService.getShuffle()) {
        this.queueService.setQueue([song, ...shuffleArr(this.songs.filter(s => s.id !== song.id))])
      } else {
        this.queueService.setQueue([...this.songs]);
      }
      this.playerService.playSong(song);
    }
  }
}
