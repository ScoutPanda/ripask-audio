import {Component, Input} from '@angular/core';
import {Genre} from "../subsonic/subsonic.model";

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent {
  @Input() genres: Genre[] = [];

  constructor() { }
}
