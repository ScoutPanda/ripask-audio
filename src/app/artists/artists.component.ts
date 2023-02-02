import {Component, OnInit} from "@angular/core";
import {SubsonicService} from "../subsonic/subsonic.service";
import {ArtistList} from "../subsonic/subsonic.model";

@Component({
  selector: "app-artists",
  templateUrl: "./artists.component.html",
  styleUrls: ["./artists.component.scss"]
})
export class ArtistsComponent implements OnInit {
  artists: ArtistList[] = [];

  constructor(private subsonicService: SubsonicService) {
  }

  ngOnInit(): void {
    this.subsonicService.getArtistList().subscribe(res => this.artists = res);
  }
}
