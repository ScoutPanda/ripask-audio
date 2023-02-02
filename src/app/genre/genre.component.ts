import {Component, OnInit} from "@angular/core";
import {SubsonicService} from "../subsonic/subsonic.service";
import {Album} from "../subsonic/subsonic.model";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-genre",
  templateUrl: "./genre.component.html",
  styleUrls: ["./genre.component.scss"]
})
export class GenreComponent implements OnInit {
  albums: Album[] = [];
  genre = "";

  constructor(private subsonicService: SubsonicService,
              private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.genre = this.router.snapshot.paramMap.get("id") as string;
    this.subsonicService.getAlbumListBy("byGenre", 0, this.genre).subscribe(res => {
      this.albums = res;
    })
  }
}
