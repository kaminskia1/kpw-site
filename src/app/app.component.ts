import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {BackgroundService} from "./api/background.service";
import {Background} from "./shared/models/background.model";
import {animate, state, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '(window:resize)': 'onResize()'
  },
  animations: [
    trigger('preload', [
      state('false', style({opacity: 1})),
      state('true', style({opacity: 0, display: 'none'})),
      transition('false => true', animate("1000ms 500ms", style({opacity: 0})))
    ]),

    trigger('imageLoaded', [
      state('false', style({opacity: 0})),
      state('true', style({opacity: 1})),
      transition('true => false', animate(".25s", style({opacity: 0}))),
      transition('false => true', animate(".25s .5s", style({opacity: 1})))
    ]),

    trigger('locationLoaded', [
      state('false', style({width: "0px"})),
      state('true', style({})),
      transition('true => false', animate(".15s")),
      transition('false => true', animate(".15s 1s"))
    ])

  ]
})
export class AppComponent implements OnInit {

  title: string = 'Portfolio';
  backgroundObj = new Background();
  pageLoaded: boolean = false;
  imageLoaded: boolean = false;
  locationLoaded: boolean = false;
  links = [
    {
      url: "https://kaminski.pw/resume",
      icon: "picture_as_pdf",
      name: "Resume",
    },
    {
      url: "https://kaminski.pw/github",
      icon: "code",
      name: "GitHub",
    },
    {
      url: "https://kaminski.pw/linkedin",
      icon: "group",
      name: "Linkedin",
    },
    {
      url: "https://files.kaminski.pw/",
      icon: "folder_open",
      name: "Files / Media",
    }
  ]


  @ViewChild('background') private backgroundElement: ElementRef | undefined;
  @ViewChild('preload') private preloadElement: ElementRef | undefined;

  constructor(private backgroundService: BackgroundService) {
  }

  ngOnInit() {
    this.setBackground().then(r => r);
  }

  async setBackground() {
    this.imageLoaded = false;
    this.locationLoaded = false;
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

  @HostListener('window:resize', ['$event'])
  onResize() {

    let columnWidth = window.innerWidth / 2
    let columnHeight = window.innerHeight;

    // @ts-ignore
    let eleWidth = this.backgroundElement.nativeElement.clientWidth;
    // @ts-ignore
    let eleHeight = this.backgroundElement.nativeElement.clientHeight;

    if (eleWidth <= columnWidth || eleHeight > columnHeight + 1) {
      this.backgroundObj.offsetWidth = "";
      this.backgroundObj.offsetHeight = "-" + (eleHeight - columnHeight) / 2 + "px";
      this.backgroundObj.width = columnWidth + "px";
      this.backgroundObj.height = "";
    } else {
      this.backgroundObj.offsetWidth = "-" + (eleWidth - columnWidth) / 2 + "px";
      this.backgroundObj.offsetHeight = "";
      this.backgroundObj.width = "";
      this.backgroundObj.height = "100%";
    }
  }

  // @TODO: Incorporate this into onResize, as it's virtually identical
  onLoad() {

    // @ts-ignore
    let eleWidth = this.backgroundElement.nativeElement.naturalWidth;
    // @ts-ignore
    let eleHeight = this.backgroundElement.nativeElement.naturalHeight;

    let windowWidth = window.innerWidth / 2
    let windowHeight = window.innerHeight

    // Compare image ratio to client's view box ratio
    // Height / ClientHeight to ImgWidth / ClientWidth to determine which 100% will make image cover screen
    if (eleHeight / windowHeight > eleWidth / windowWidth) {

      // width == window.innerWidth / 2
      let ratio = eleWidth / (window.innerWidth / 2)

      this.backgroundObj.width = windowWidth + "px";
      this.backgroundObj.height = eleHeight / ratio + "px";
      this.backgroundObj.offsetWidth = "";
      this.backgroundObj.offsetHeight = "-" + ((eleHeight / ratio) - windowHeight) / 2 + "px";

    } else {
      // height = window.innerHeight
      let ratio = eleHeight / windowHeight;

      this.backgroundObj.width = eleWidth / ratio + "px";
      this.backgroundObj.height = windowHeight + "px";
      this.backgroundObj.offsetWidth = "-" + ((eleWidth / ratio) - windowWidth) / 2 + "px";
      this.backgroundObj.offsetHeight = "";

    }

    this.pageLoaded = true;
    this.imageLoaded = true;
    this.locationLoaded = true;
  }

}
