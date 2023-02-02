import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {PlayerService} from "./player/player.service";
import {GlobalsService} from "./globals.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("player") player_elem: ElementRef | undefined;
  loaded = false;

  constructor(private playerService: PlayerService, private globals: GlobalsService) {
  }

  get authenticated(): boolean {
    return this.globals.authenticated;
  }

  ngAfterViewInit(): void {
    if (this.player_elem) {
      this.playerService.setPlayer(this.player_elem.nativeElement as HTMLAudioElement);
      setTimeout(() => this.loaded = true);
    }
  }

  ngOnInit(): void {
    this.globals.isAuthenticated().subscribe();
  }
}
