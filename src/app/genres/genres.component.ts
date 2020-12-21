import {Component, OnInit} from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {Genre} from "../subsonic/subsonic.model";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {
  genres: Genre[] = [];

  constructor(private subsonicService: SubsonicService) { }

  ngOnInit(): void {
    this.subsonicService.getGenres().subscribe(genres => {
      forkJoin(genres.map(g => this.subsonicService.getAlbumListBy("byGenre", 4, g.value))).subscribe(albums => {
        const tempGenres: Genre[] = [];
        for (let i = 0; i < albums.length; i++) {
          tempGenres.push(new Genre(genres[i], albums[i]));
        }
        this.genres = tempGenres.sort((a, b) => this.compare(a.value, b.value));
      })
    })
  }

  compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}
