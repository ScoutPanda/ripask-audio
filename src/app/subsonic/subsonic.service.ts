import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  Album,
  ApiAlbumSongs, ApiGenre,
  ApiGetAlbum,
  ApiGetAlbumListBy,
  ApiGetGenres,
  ApiGetRandomSongs,
  Song
} from "./subsonic.model";
import {map} from "rxjs/operators";
import {GlobalsService} from "../globals.service";

@Injectable({
  providedIn: 'root'
})
export class SubsonicService {
  constructor(private http: HttpClient, private globals: GlobalsService) {}

  getAlbumListBy(type: string, size: number = 0, genre: string = ""): Observable<Album[]> {
    const url = this.globals.getUrl("getAlbumList");
    let params = this.globals.params.append("type", type);
    params = params.append("size", !size ? this.globals.autoAlbumSize.toString() : size.toString());
    if (genre) {
      params = params.append("genre", genre);
    }
    return this.http.get<ApiGetAlbumListBy>(url, {params: params})
      .pipe(map(v => v.albumList.album.map(a => new Album(a, this.getCoverArtUrl(a)))));
  }

  getRandomSongs(genre: string = ""): Observable<Song[]> {
    const url = this.globals.getUrl("getRandomSongs");
    let params = this.globals.params.append("size", this.globals.autoPlaylistSize.toString());
    if (genre && genre !== "Random") {
      params = params.append("genre", genre);
    }
    return this.http.get<ApiGetRandomSongs>(url, {params: params})
      .pipe(map(v => v.randomSongs.song.map(s => new Song(s, this.getCoverArtUrl(s), this.getSongUrl(s)))));
  }

  getGenres(): Observable<ApiGenre[]> {
    const url = this.globals.getUrl("getGenres");
    return this.http.get<ApiGetGenres>(url, {params: this.globals.params})
      .pipe(map(v => v.genres.genre));
  }

  getAlbumAndSongs(album: ApiAlbumSongs): {album: Album, songs: Song[]} {
    return {album: new Album(album, this.getCoverArtUrl(album)), songs: album.song.map(s => new Song(s, this.getCoverArtUrl(s), this.getSongUrl(s)))};
  }

  getAlbum(id: string): Observable<ApiAlbumSongs> {
    const url = this.globals.getUrl("getAlbum");
    return this.http.get<ApiGetAlbum>(url, {params: this.globals.params.append("id", id)})
      .pipe(map(v => v.album));
  }

  private getSongUrl({id}: {id: string}) {
    return id ? `${this.globals.getUrl("stream")}?${this.globals.params.append("id", id)}` : "";
  }

  private getCoverArtUrl({coverArt}: {coverArt: string}) {
    return coverArt ? `${this.globals.getUrl("getCoverArt")}?${this.globals.params.append("id", coverArt)}&size=300` : "";
  }
}
