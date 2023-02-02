import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable} from "rxjs";
import {
  Album,
  ApiAlbumSongs,
  ApiArtist,
  ApiArtistList,
  ApiGenre,
  ApiGetAlbum,
  ApiGetAlbumListBy,
  ApiGetArtist,
  ApiGetArtistList,
  ApiGetGenres,
  ApiGetMusicDirectory,
  ApiGetRandomSongs,
  ApiMusicDirectory,
  ApiSong,
  Artist,
  ArtistList,
  Song
} from "./subsonic.model";
import {map, tap} from "rxjs/operators";
import {GlobalsService} from "../globals.service";
import {filterLimit, generateAvatar} from "../helpers";

@Injectable({
  providedIn: "root"
})
export class SubsonicService {
  constructor(private http: HttpClient, private globals: GlobalsService) {
  }

  getAlbumListBy(type: string, size = 0, genre = ""): Observable<Album[]> {
    const url = this.globals.getUrl("getAlbumList");
    let params = this.globals.params.append("type", type);
    params = params.append("size", !size ? this.globals.autoAlbumSize.toString() : size.toString());
    if (genre) {
      params = params.append("genre", genre);
    }
    return this.http.get<ApiGetAlbumListBy>(url, {params: params})
      .pipe(map(v => v.albumList.album.map(a => new Album(a, this.getCoverArtUrl(a)))));
  }

  getArtistList(): Observable<ArtistList[]> {
    const url = this.globals.getUrl("getArtistList");
    let params = this.globals.params.append("type", "alphabeticalByName");
    params = params.append("size", this.globals.autoArtistSize.toString());
    const artist = this.http.get<ApiGetArtistList>(url, {params: params});
    const albums = this.getAlbumListBy("alphabeticalByName");
    return forkJoin([artist, albums])
      .pipe(map(res => res[0].artistList.artist.map(a => new ArtistList(a, this.getArtistListCoverArtUrl(a, res[1])))))
  }

  getArtist(id: string): Observable<Artist> {
    const url = this.globals.getUrl("getArtist");
    const params = this.globals.params.append("id", id);
    return this.http.get<ApiGetArtist>(url, {params: params})
      .pipe(map(v => new Artist(v.artist, v.artist.album.map(a => new Album(a, this.getCoverArtUrl(a))), this.getArtistCoverArtUrl(v.artist))));
  }

  getRandomSongs(genre = ""): Observable<Song[]> {
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
      .pipe(
        tap(v => v.genres.genre.push(new ApiGenre())),
        map(v => v.genres.genre)
      );
  }

  getAlbumAndSongs(album: ApiAlbumSongs): { album: Album, songs: Song[] } {
    return {
      album: new Album(album, this.getCoverArtUrl(album)),
      songs: album.song.map(s => new Song(s, this.getCoverArtUrl(s), this.getSongUrl(s)))
    };
  }

  getAlbum(id: string): Observable<ApiAlbumSongs> {
    const url = this.globals.getUrl("getAlbum");
    return this.http.get<ApiGetAlbum>(url, {params: this.globals.params.append("id", id)})
      .pipe(map(v => v.album));
  }

  getSongsByArtist(id: string): Observable<Song[]> {
    return this.getMusicDirectory<ApiSong>(id).pipe(
      map(v => filterLimit(v.child, c => !c.isDir, this.globals.autoPlaylistSize).map(c => new Song(c, this.getCoverArtUrl(c), this.getSongUrl(c))))
    )
  }

  getMusicDirectory<A>(id: string): Observable<ApiMusicDirectory<A>> {
    const url = this.globals.getUrl("getMusicDirectory");
    const params = this.globals.params.append("id", id);
    return this.http.get<ApiGetMusicDirectory<A>>(url, {params: params})
      .pipe(map(v => v.directory));
  }

  scrobble({id}: { id: string }): Observable<void> {
    const url = this.globals.getUrl("scrobble");
    const params = this.globals.params.append("id", id);
    return this.http.get<void>(url, {params: params});
  }

  private getSongUrl({id}: { id: string }): string {
    return id ? `${this.globals.getUrl("stream")}?${this.globals.params.append("id", id)}` : "";
  }

  private getCoverArtUrl({coverArt}: { coverArt: string }): string {
    return coverArt ? `${this.globals.getUrl("getCoverArt")}?${this.globals.params.append("id", coverArt)}&size=300` : "";
  }

  private getArtistListCoverArtUrl(artist: ApiArtistList, albums: Album[]): string[] {
    const res = filterLimit(albums, a => a.artistId === artist.id, 4);
    if (!res || res.length < 1) {
      return [generateAvatar(artist.name)];
    } else if (res.length === 2) {
      res.push(res[1], res[0]);
    } else if (res.length === 3) {
      res.push(res[0]);
    }
    return res.map(a => a.coverArtUrl);
  }

  private getArtistCoverArtUrl(artist: ApiArtist): string[] {
    const albums = artist.album.slice(0, 4);
    if (!albums || albums.length < 1) {
      return [generateAvatar(artist.name)];
    } else if (albums.length === 2) {
      albums.push(albums[1], albums[0]);
    } else if (albums.length === 3) {
      albums.push(albums[0]);
    }
    return albums.map(a => this.getCoverArtUrl(a));
  }
}
