import {Component, OnInit} from "@angular/core";
import {SubsonicService} from "../subsonic/subsonic.service";
import {Album, Song} from "../subsonic/subsonic.model";
import {ActivatedRoute} from "@angular/router";
import {secondsToString} from "../helpers";
import {PlayerService} from "../player/player.service";

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.scss"]
})
export class AlbumComponent implements OnInit {
  album: Album | undefined;
  songs: Song[] = [];
  songCount = 0;
  duration = "";

  constructor(private subsonicService: SubsonicService,
              private playerService: PlayerService,
              private router: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get("id") as string;
    this.subsonicService.getAlbum(id).subscribe(res => {
      const {album, songs} = this.subsonicService.getAlbumAndSongs(res);
      this.album = album;
      this.songs = songs;
      this.songCount = songs.length;
      this.duration = secondsToString(songs.reduce((a, b) =>  a + b.duration, 0));
    });
  }

  playSongs(): void {
    this.playerService.playSongs(this.songs);
  }
}
