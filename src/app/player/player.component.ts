import {Component, HostBinding, ViewEncapsulation} from "@angular/core";
import {PlayerService, Repeat} from "./player.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PlayerComponent {
  @HostBinding("class.player") player = true;

  Repeat = Repeat;

  get shuffle(): boolean {
    return this.playerService.getShuffle();
  }

  get repeat(): Repeat {
    return this.playerService.getRepeat();
  }

  constructor(public playerService: PlayerService) {
  }

  coverArtUrl(): string {
    return this.playerService.songLoaded() ? this.playerService.currentSong?.coverArtUrl || "" : "";
  }

  setCurrentTime(value: number) {
    this.playerService.setCurrentTime(value);
  }

  onInputChange({value}: {value: number | null}) {
    if (value !== null) {
      this.playerService.playerVolume = value;
    }
  }

  getPlayIcon(): string {
    return this.playerService.paused ? "play_circle_filled" : "pause_circle_filled";
  }

  getVolumeIcon(): string {
    if (this.playerService.playerVolume > 0.5) {
      return "volume_up";
    } else if (this.playerService.playerVolume > 0) {
      return "volume_down";
    } else {
      return "volume_off";
    }
  }

  playRandomSongs() {
    this.playerService.playRandomSongs();
  }
}
