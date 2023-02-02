import {Component, OnInit} from "@angular/core";
import {GlobalsService} from "../globals.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  username = "";
  password = "";
  server = "";

  constructor(private globals: GlobalsService, private router: Router) {
  }

  ngOnInit(): void {
    this.username = this.globals.user;
    this.password = this.globals.password;
    this.server = this.globals.baseurl;
  }

  save(): void {
    this.globals.setUser(this.username, this.password, this.server).subscribe(res => {
      if (res) {
        this.router.navigate(["recents"]).then();
      }
    });
  }
}
