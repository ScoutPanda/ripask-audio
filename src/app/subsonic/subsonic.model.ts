import {secondsToString} from "../helpers";

class ApiBaseResponse {
  status = "";
  version = "";
  error?: ApiSubsonicError
}

class ApiSubsonicError {
  code = 0;
  message = "";
}

export class ApiSong {
  id = "";
  parent = "";
  title = "";
  artist = "";
  artistId = "";
  album = "";
  albumId = "";
  genre = "";
  coverArt = "";
  size = "";
  contentType = "";
  suffix = "";
  duration = 0;
  path = "";
  type = "";
  isDir = false;
  bitRate = 0;
  created = "";
  year = 0;
  track = 0;
}

export class Song {
  id = "";
  songUrl = "";
  title = "";
  artist = "";
  coverArtUrl = "";
  duration = 0;
  length = "";
  album = "";
  track = 0;
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
  albumList2: {
    album: ApiAlbum[];
  } = {album: []};
}

export class ApiGetAlbum extends ApiBaseResponse {
  album: ApiAlbumSongs = new ApiAlbumSongs();
}

export class ApiAlbum {
  id = "";
  parent = "";
  title = "";
  album = "";
  artist = "";
  artistId = "";
  isDir = false;
  duration = 0;
  songCount = 0;
  coverArt = "";
  created = "";
  year = 0;
}

export class Album {
  id = "";
  album = "";
  artist = "";
  artistId = "";
  year = 0;
  coverArtUrl = "";
  songCount = 0;

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
  songCount = "";
  albumCount = "";
  value = "";
}

export class Genre {
  value = "";
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
  id = "";
  name = "";
  coverArt = "";
  albumCount = 0;
  album: ApiAlbum[] = [];
}

export class Artist {
  id = "";
  name = "";
  coverArtUrls: string[] = [""];
  albumCount = 0;
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
  id = "";
  name = "";
  coverArt = "";
  albumCount = 0;
}

export class ApiGetArtistList extends ApiBaseResponse {
  ignoredArticles = "";
  artists: {
    index: ApiGetArtistListIndexItem[];
  } = {index: []};
}

export class ApiGetArtistListIndexItem {
  name = "";
  artist: ApiArtistList[] = [];
}

export class ArtistList {
  id = "";
  name = "";
  coverArtUrls: string[] = [""];

  constructor(artist: ApiArtistList, coverArtUrls: string[]) {
    this.id = artist.id;
    this.name = artist.name;
    this.coverArtUrls = coverArtUrls;
  }
}

export class ApiGetMusicDirectory<A> extends ApiBaseResponse {
  directory: ApiMusicDirectory<A> = {id: "", name: "", child: []}
}

export class ApiMusicDirectory<A> {
  id = "";
  name = "";
  child: A[] = [];
}
