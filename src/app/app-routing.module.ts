import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecentsComponent} from "./recents/recents.component";
import {AlbumsComponent} from "./albums/albums.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumComponent} from "./album/album.component";
import {GenreComponent} from "./genre/genre.component";
import {QueueComponent} from "./queue/queue.component";
import {AccountComponent} from "./account/account.component";
import {AuthGuardService} from "./auth/auth-guard.service";
import {ArtistsComponent} from "./artists/artists.component";
import {ArtistComponent} from "./artist/artist.component";

const routes: Routes = [
  {path: "account", pathMatch: "full", component: AccountComponent},
  {path: "recents", pathMatch: "full", canActivate: [AuthGuardService], component: RecentsComponent},
  {path: "albums", pathMatch: "full", canActivate: [AuthGuardService], component: AlbumsComponent},
  {path: "album/:id", pathMatch: "full", canActivate: [AuthGuardService], component: AlbumComponent},
  {path: "genres", pathMatch: "full", canActivate: [AuthGuardService], component: GenresComponent},
  {path: "genre", pathMatch: "full", canActivate: [AuthGuardService], component: GenreComponent},
  {path: "genre/:id", pathMatch: "full", canActivate: [AuthGuardService], component: GenreComponent},
  {path: "queue", pathMatch: "full", canActivate: [AuthGuardService], component: QueueComponent},
  {path: "artists", pathMatch: "full", canActivate: [AuthGuardService], component: ArtistsComponent},
  {path: "artist/:id", pathMatch: "full", canActivate: [AuthGuardService], component: ArtistComponent},
  {path: "", redirectTo: "/recents", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
