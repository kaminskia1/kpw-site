import {
  Component, ElementRef, HostListener, Inject, OnInit, ViewChild,
} from '@angular/core';
import {
  animate, state, style, transition, trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { FileReaderService } from '../../shared/services/file-reader/file-reader.service';
import { ContentBlocksService } from '../../shared/services/content-blocks/content-blocks.service';
import { BackgroundService } from '../../shared/services/background/background.service';
import { BackgroundModel } from '../../shared/models/background/background.model';
import { BackgroundLinkModel } from '../../shared/models/background-url/background-link.model';
import { ContentBlockModel } from '../../shared/models/link-item/content-block.model';

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

  title: string = 'Portfolio';

  leftWidth: string = '50%';

  pageLoaded: boolean = false;

  imageLoaded: boolean = false;

  backgroundInfo: BackgroundModel;

  contentBlocks?: ContentBlockModel[];

  constructor(
    private backgroundService: BackgroundService,
    private contentBlocksService: ContentBlocksService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(FileReaderService) private reader: FileReader,
  ) {
    this.document = document;
    this.backgroundService = backgroundService;
    this.contentBlocksService = contentBlocksService;
    this.reader = reader;

    this.backgroundInfo = {
      offsetWidth: '',
      offsetHeight: '',
      width: '',
      height: '100%',
      location: '',
      data: null,
    };
  }

  ngOnInit() {
    this.reader.addEventListener('load', () => {
      this.backgroundInfo.data = this.reader.result;
    }, false);

    this.setContentBlocks();
    this.updateBackground();
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

  updateBackground() {
    const { location } = this.backgroundInfo;
    this.imageLoaded = false;
    this.backgroundService.getBackgroundUrl(location).subscribe((url: BackgroundLinkModel) => {
      this.backgroundService.getBackgroundImage(url.url).subscribe((data: Blob) => {
        // Delay allows animations to catch up.
        setTimeout(() => {
          this.backgroundInfo.data = null;
          this.backgroundInfo.location = url.location;
          this.reader.readAsDataURL(data);
        }, 250);
      });
    });
  }

  setContentBlocks() {
    this.contentBlocksService.getContentBlocks().subscribe((contentBlocks: ContentBlockModel[]) => {
      this.contentBlocks = contentBlocks;
    });
  }
}
