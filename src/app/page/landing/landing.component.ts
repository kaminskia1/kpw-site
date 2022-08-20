import {
  Component, ElementRef, HostListener, Inject, OnInit, ViewChild,
} from '@angular/core';
import {
  animate, state, style, transition, trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { BackgroundModel } from '../../shared/models/background/background.model';
import { BackgroundService } from '../../shared/services/background/background.service';
import { LinkItem } from '../../shared/models/link-item/link-item.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('preload', [
      state('false', style({ opacity: 1 })),
      state('true', style({ opacity: 0, display: 'none' })),
      transition('false => true', animate('1000ms 500ms', style({ opacity: 0 }))),
    ]),

    trigger('image', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('true => false', animate('.25s', style({ opacity: 0 }))),
      transition('false => true', animate('.25s .5s', style({ opacity: 1 }))),
    ]),

    trigger('location', [
      state('false', style({ width: '0px' })),
      state('true', style({})),
      transition('true => false', animate('.15s')),
      transition('false => true', animate('.15s 1s')),
    ]),
  ],
})
export class LandingComponent implements OnInit {
  @ViewChild('background') backgroundElement: ElementRef | undefined;

  @ViewChild('left') leftElement: ElementRef | undefined;

  @ViewChild('right') rightElement: ElementRef | undefined;

  backgroundService: BackgroundService;

  document: Document;

  title: string = 'Portfolio';

  leftWidth: string = '50%';

  pageLoaded: boolean = false;

  imageLoaded: boolean = false;

  backgroundObj = {
    offsetWidth: '',
    offsetHeight: '',
    width: '',
    height: '100%',
    location: '0-',
    data: null,
  } as BackgroundModel;

  links: LinkItem[] = [
    {
      url: 'https://kaminski.pw/resume',
      icon: 'picture_as_pdf',
      name: 'Resume',
    },
    {
      url: 'https://kaminski.pw/linkedin',
      icon: 'group',
      name: 'Linkedin',
    },
    {
      url: 'https://kaminski.pw/github',
      icon: 'code',
      name: 'GitHub',
    },
    {
      url: 'https://files.kaminski.pw/',
      icon: 'folder_open',
      name: 'Files / Media',
    },
  ];

  constructor(backgroundService: BackgroundService, @Inject(DOCUMENT) document: Document) {
    this.backgroundService = backgroundService;
    this.document = document;
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
            setTimeout(() => {
              this.backgroundObj.data = null;
              if (this.backgroundObj.location !== response.location) {
                this.backgroundObj.location = response.location;
              }
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                this.backgroundObj.data = reader.result;
              }, false);
              if (blob) {
                reader.readAsDataURL(blob);
              }
            }, 250);
          },
        );
      },
    );
  }

  onLoad() {
    this.updateBackgroundSize();
    this.pageLoaded = true;
    this.imageLoaded = true;
  }

  @HostListener('window:resize', ['$event'])
  updateBackgroundSize() {
    const rightWidth = this.rightElement?.nativeElement.offsetWidth;
    if (this.document.defaultView && rightWidth) {
      this.leftWidth = `${(0.994 - (rightWidth / this.document.defaultView.innerWidth)) * 100}%`;
    }
  }
}
