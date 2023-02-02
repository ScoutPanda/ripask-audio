import {Component} from "@angular/core";
import {Link} from "./navbar.model";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent {
  links: Link[] = [{name: "Recents", path: "recents"}, {name: "Artists", path: "artists"}, {name: "Albums", path: "albums"}, {name: "Genres", path: "genres"}];
}
