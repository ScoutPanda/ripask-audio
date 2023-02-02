import {Component} from "@angular/core";
import {Song} from "../subsonic/subsonic.model";
import {QueueService} from "./queue.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent {
  constructor(private queueService: QueueService) {
  }

  get queue(): Song[] {
    return this.queueService.queue;
  }
}
