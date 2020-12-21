import {Component, OnInit} from '@angular/core';
import {SubsonicService} from "../subsonic/subsonic.service";
import {Album} from "../subsonic/subsonic.model";

@Component({
  selector: 'app-recents',
  templateUrl: './recents.component.html',
  styleUrls: ['./recents.component.scss']
})
export class RecentsComponent implements OnInit {
  recents: Album[] = [];

  constructor(private subsonicService: SubsonicService) { }

  ngOnInit(): void {
    this.subsonicService.getAlbumListBy("recent", 40).subscribe(res => {
      this.recents = res;
    })
  }
}
