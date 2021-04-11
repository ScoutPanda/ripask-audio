import {Component, OnInit} from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {Album, Artist} from "../subsonic/subsonic.model";
import {ActivatedRoute} from "@angular/router";
import {PlayerService} from "../player/player.service";

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  artist: Artist | undefined;
  albums: Album[] = [];

  constructor(private subsonicService: SubsonicService,
              private playerService: PlayerService,
              private router: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get("id") as string;
    this.subsonicService.getArtist(id).subscribe(res => {
      this.artist = res;
      this.albums = res.album;
    });
  }

  playArtist() {
    if (this.artist) {
      this.playerService.playArtist(this.artist);
    }
  }
}
