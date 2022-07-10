import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Background } from "../../shared/models/background.model";
import { BackgroundService } from "../../api/background.service";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'kpw-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  host: {},
  animations: [
    trigger('preload', [
      state('false', style({opacity: 1})),
      state('true', style({opacity: 0, display: 'none'})),
      transition('false => true', animate("1000ms 500ms", style({opacity: 0})))
    ]),

    trigger('image', [
      state('false', style({opacity: 0})),
      state('true', style({opacity: 1})),
      transition('true => false', animate(".25s", style({opacity: 0}))),
      transition('false => true', animate(".25s .5s", style({opacity: 1})))
    ]),

    trigger('location', [
      state('false', style({width: "0px"})),
      state('true', style({})),
      transition('true => false', animate(".15s")),
      transition('false => true', animate(".15s 1s"))
    ])
  ]
})
export class LandingComponent implements OnInit {
  title: string = 'Portfolio';
  backgroundObj = new Background();
  pageLoaded: boolean = false;
  imageLoaded: boolean = false;
  links = [
    {
      url: "https://kaminski.pw/resume",
      icon: "picture_as_pdf",
      name: "Resume",
    },
    {
      url: "gallery",
      icon: "camera",
      name: "Gallery",
    },
    {
      url: "https://kaminski.pw/linkedin",
      icon: "group",
      name: "Linkedin",
    },
    {
      url: "https://kaminski.pw/github",
      icon: "code",
      name: "GitHub",
    },
    {
      url: "https://files.kaminski.pw/",
      icon: "folder_open",
      name: "Files / Media",
    }
  ]


  @ViewChild('background') private backgroundElement: ElementRef | undefined;

  constructor(private backgroundService: BackgroundService) {
  }

  ngOnInit() {
    this.setBackground();
  }

  setBackground() {
    this.imageLoaded = false;
    this.backgroundService.getBackgroundUrl().subscribe(
      (response) => {
        this.backgroundService.getBackgroundImage(response.url).subscribe(
          (blob: Blob) => {
            // Delay allows animations to catch up.
            //@TODO: Refactor this with animation callbacks
            setTimeout(()=>{
              this.backgroundObj.data = null;
              if (this.backgroundObj.location !== response.location) this.backgroundObj.location = response.location;
              let reader = new FileReader();
              reader.addEventListener("load", () => {
                this.backgroundObj.data = reader.result;
              }, false);

              if (blob) {
                reader.readAsDataURL(blob);
              }
            }, 250)

          }
        )
      });
  }

  onLoad() {
    this.pageLoaded = true;
    this.imageLoaded = true;
  }
}
