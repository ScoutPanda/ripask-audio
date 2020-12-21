import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RecentsComponent} from "./recents/recents.component";
import {AlbumsComponent} from "./albums/albums.component";
import {GenresComponent} from "./genres/genres.component";
import {AlbumComponent} from "./album/album.component";
import {GenreComponent} from "./genre/genre.component";
import {QueueComponent} from "./queue/queue.component";
import {AccountComponent} from "./account/account.component";
import {AuthGuardService} from "./auth/auth-guard.service";

const routes: Routes = [
  { path: "account", pathMatch: "full", component: AccountComponent },
  { path: "recents", pathMatch: "full", canActivate: [AuthGuardService], component: RecentsComponent },
  { path: "albums", pathMatch: "full", canActivate: [AuthGuardService], component: AlbumsComponent },
  { path: "album/:id", pathMatch: "full", canActivate: [AuthGuardService], component: AlbumComponent },
  { path: "genres", pathMatch: "full", canActivate: [AuthGuardService], component: GenresComponent },
  { path: "genre/:id", pathMatch: "full", canActivate: [AuthGuardService], component: GenreComponent },
  { path: "queue", pathMatch: "full", canActivate: [AuthGuardService], component: QueueComponent },
  { path: "",   redirectTo: "/recents", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
