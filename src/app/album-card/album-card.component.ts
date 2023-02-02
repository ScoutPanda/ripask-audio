import {Component, Input} from "@angular/core";
import {Album} from "../subsonic/subsonic.model";
import {PlayerService} from "../player/player.service";

@Component({
  selector: "app-album-card",
  templateUrl: "./album-card.component.html",
  styleUrls: ["./album-card.component.scss"]
})
export class AlbumCardComponent {
  @Input() album: Album | null = null;

  constructor(private playerService: PlayerService) {
  }

  playAlbum(id: string): void {
    this.playerService.playAlbum(id);
  }
}
