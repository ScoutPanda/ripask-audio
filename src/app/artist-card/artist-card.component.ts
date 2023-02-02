import {Component, Input} from "@angular/core";
import {ArtistList} from "../subsonic/subsonic.model";
import {PlayerService} from "../player/player.service";

@Component({
  selector: "app-artist-card",
  templateUrl: "./artist-card.component.html",
  styleUrls: ["./artist-card.component.scss"]
})
export class ArtistCardComponent {
  @Input() artist: ArtistList | null = null;

  constructor(private playerService: PlayerService) {
  }

  playArtist(artist: ArtistList): void {
    this.playerService.playArtist(artist.id);
  }
}
