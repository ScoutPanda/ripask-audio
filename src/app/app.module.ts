import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TransformInterceptor} from "./interceptor/transform.interceptor";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {PlayerComponent} from "./player/player.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {QueueComponent} from "./queue/queue.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {RecentsComponent} from "./recents/recents.component";
import {AlbumCardComponent} from "./album-card/album-card.component";
import {AlbumsComponent} from "./albums/albums.component";
import {GenresComponent} from "./genres/genres.component";
import {PlayerSliderComponent} from "./player/player-slider.component";
import {AlbumListComponent} from "./album-list/album-list.component";
import {AlbumComponent} from "./album/album.component";
import {GenreComponent} from "./genre/genre.component";
import {GenreCardComponent} from "./genre-card/genre-card.component";
import {GenreListComponent} from "./genre-list/genre-list.component";
import {SongListComponent} from "./song-list/song-list.component";
import {AccountComponent} from "./account/account.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    QueueComponent,
    NavbarComponent,
    RecentsComponent,
    AlbumsComponent,
    AlbumCardComponent,
    GenresComponent,
    GenreComponent,
    GenreListComponent,
    GenreCardComponent,
    PlayerSliderComponent,
    AlbumListComponent,
    AlbumComponent,
    SongListComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TransformInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
