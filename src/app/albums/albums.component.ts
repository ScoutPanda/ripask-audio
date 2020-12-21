import {Component, OnInit} from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {Album} from "../subsonic/subsonic.model";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];

  constructor(private subsonicService: SubsonicService) { }

  ngOnInit(): void {
    this.subsonicService.getAlbumListBy("alphabeticalByName").subscribe(res => {
      this.albums = res;
    })
  }
}
