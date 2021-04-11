import {secondsToString} from "../helpers";

class ApiBaseResponse {
  status: string = "";
  version: string = "";
  error?: ApiSubsonicError
}

class ApiSubsonicError {
  code: number = 0;
  message: string = "";
}

export class ApiSong {
  id: string = "";
  parent: string = "";
  title: string = "";
  artist: string = "";
  artistId: string = "";
  album: string = "";
  albumId: string = "";
  genre: string = "";
  coverArt: string = "";
  size: string = "";
  contentType: string = "";
  suffix: string = "";
  duration: number = 0;
  path: string = "";
  type: string = "";
  isDir: boolean = false;
  bitRate: number = 0;
  created: string = "";
  year: number = 0;
  track: number = 0;
}

export class Song {
  id: string = "";
  songUrl: string = "";
  title: string = "";
  artist: string = "";
  coverArtUrl: string = "";
  duration: number = 0;
  length: string = "";
  album: string = "";
  track: number = 0;
  preloaded = false;

  constructor(song: ApiSong, coverArtUrl: string, songUrl: string) {
    this.id = song.id;
    this.songUrl = songUrl;
    this.title = song.title;
    this.artist = song.artist;
    this.coverArtUrl = coverArtUrl;
    this.duration = song.duration;
    this.length = secondsToString(song.duration, "short");
    this.album = song.album;
    this.track = song.track;
  }
}

export class ApiGetRandomSongs extends ApiBaseResponse {
  randomSongs: {
    song: ApiSong[];
  } = {song: []};
}

export class ApiGetAlbumListBy extends ApiBaseResponse {
  albumList: {
    album: ApiAlbum[];
  } = {album: []};
}

export class ApiGetAlbum extends ApiBaseResponse {
  album: ApiAlbumSongs = new ApiAlbumSongs();
}

export class ApiAlbum {
  id: string = "";
  parent: string = "";
  title: string = "";
  album: string = "";
  artist: string = "";
  artistId: string = "";
  isDir: boolean = false;
  duration: number = 0;
  songCount: number = 0;
  coverArt: string = "";
  created: string = "";
  year: number = 0;
}

export class Album {
  id: string = "";
  album: string = "";
  artist: string = "";
  artistId: string = "";
  year: number = 0;
  coverArtUrl: string = "";
  songCount: number = 0;

  constructor(album: ApiAlbum, coverArtUrl: string) {
    this.id = album.id;
    this.album = album.album;
    this.artist = album.artist;
    this.artistId = album.artistId;
    this.year = album.year;
    this.coverArtUrl = coverArtUrl;
    this.songCount = album.songCount;
  }
}

export class ApiAlbumSongs extends ApiAlbum {
  song: ApiSong[] = [];
}

export class ApiGetGenres extends ApiBaseResponse {
  genres: {
    genre: ApiGenre[];
  } = {genre: []};
}

export class ApiGenre {
  songCount: string = "";
  albumCount: string = "";
  value: string = "";
}

export class Genre {
  value: string = "";
  coverArtUrls: string[];

  constructor(genre: ApiGenre, albums: Album[]) {
    this.value = genre.value;
    this.coverArtUrls = albums.map(v => v.coverArtUrl);
    if (this.coverArtUrls.length === 1) {
      this.coverArtUrls.push(this.coverArtUrls[0]);
    }
  }
}

export class ApiArtist {
  id: string = "";
  name: string = "";
  coverArt: string = "";
  albumCount: number = 0;
  album: ApiAlbum[] = [];
}

export class Artist {
  id: string = "";
  name: string = "";
  coverArtUrls: string[] = [""];
  albumCount: number = 0;
  album: Album[] = [];

  constructor(artist: ApiArtist, album: Album[], coverArtUrls: string[]) {
    this.id = artist.id;
    this.name = artist.name;
    this.coverArtUrls = coverArtUrls;
    this.albumCount = artist.albumCount;
    this.album = album;
  }
}

export class ApiGetArtist extends ApiBaseResponse {
  artist: ApiArtist = new ApiArtist();
}

export class ApiArtistList {
  id: string = "";
  name: string = "";
  coverArt: string = "";
  songCount: number = 0;
}

export class ApiGetArtistList extends ApiBaseResponse {
  artistList: {
    artist: ApiArtistList[];
  } = {artist: []};
}

export class ArtistList {
  id: string = "";
  name: string = "";
  coverArtUrls: string[] = [""];

  constructor(artist: ApiArtistList, coverArtUrls: string[]) {
    this.id = artist.id;
    this.name = artist.name;
    this.coverArtUrls = coverArtUrls;
  }
}

export class ApiSearch extends ApiBaseResponse {
  searchResult2: ApiSearchResult = {song: [], album: [], artist: []};
}

export class ApiSearchResult {
  song: ApiSong[] = [];
  album: ApiAlbum[] = [];
  artist: ApiArtistList[] = [];
}
