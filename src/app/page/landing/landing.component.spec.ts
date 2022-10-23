import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { of } from "rxjs";
import { LandingComponent } from './landing.component';
import { BackgroundService } from '../../shared/services/background/background.service';
import { BackgroundLinkModel } from "../../shared/models/background-url/background-link.model";
import { ContentBlocksService } from "../../shared/services/content-blocks/content-blocks.service";
import { ContentBlockModel } from "../../shared/models/link-item/content-block.model";
import { BackgroundModel } from "../../shared/models/background/background.model";
import { FileReaderService } from "../../shared/services/file-reader/file-reader.service";

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockBackgroundService: BackgroundService;
  let mockContentBlocksService: ContentBlocksService;
  let mockFileReaderService: FileReader;
  let mockDocument: Document;

  beforeEach(async () => {
    mockBackgroundService = instance(mock(BackgroundService));
    mockContentBlocksService = instance(mock(ContentBlocksService));
    mockFileReaderService = instance(mock(FileReader));
    mockDocument = instance(mock(Document));

    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      providers: [
        { provide: BackgroundService, useValue: mockBackgroundService },
        { provide: ContentBlocksService, useValue: mockContentBlocksService },
        { provide: FileReaderService, useValue: mockFileReaderService },
        { provide: Document, useValue: mockDocument },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'updateBackground');
      spyOn(component, 'setContentBlocks');
      spyOn(mockFileReaderService, 'addEventListener').and.callFake((event: string, callback: (event: Event) => void) => {
        callback(new Event('load'));
      });
      component.ngOnInit();
    });

    it('adds an event listener to the file reader', () => {
      expect(mockFileReaderService.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);

    });

    it('calls updateBackground and setContentBlocks', () => {
      expect(component.updateBackground).toHaveBeenCalled();
      expect(component.setContentBlocks).toHaveBeenCalled();
    });
  });

  describe('onLoad', () => {
    beforeEach(() => {
      spyOn(component, 'updateBackgroundSize');
      component.pageLoaded = false;
      component.imageLoaded = false;
      component.onLoad();
    });

    it('should load the page', () => {
      expect(component.updateBackgroundSize).toHaveBeenCalled();
      expect(component.pageLoaded).toBeTruthy();
      expect(component.imageLoaded).toBeTruthy();
    });
  });

  describe('updateBackgroundSize', () => {
    beforeEach(() => {
      component.leftWidth = '50%';
      component.rightElement = { nativeElement: { offsetWidth: 100 } } as ElementRef;
      component.updateBackgroundSize();
    });

    describe('when defaultView is present', () => {
      it('updates the background width', () => {
        expect(component.leftWidth).not.toBe('50%');
      });
    });
  });

  describe('updateBackground', () => {
    let backgroundModel: BackgroundModel = {
      location: 'San Diego, CA'
    } as BackgroundModel;
    let backgroundLinkModel: BackgroundLinkModel = {
      url: 'https://example.com/',
      location: 'Las Vegas, NV'
    }
    let backgroundDataBlob: Blob = {} as Blob;

    beforeEach(() => {
      spyOn(mockBackgroundService, 'getBackgroundUrl').and.returnValue(of(backgroundLinkModel));
      spyOn(mockBackgroundService, 'getBackgroundImage').and.returnValue(of(backgroundDataBlob));
      spyOn(mockFileReaderService, 'readAsDataURL');
      component.imageLoaded = true;
      component.backgroundInfo = backgroundModel;
      jasmine.clock().install();
      component.updateBackground();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    })

    it('should set imageLoaded to false', () => {
      expect(component.imageLoaded).toBeFalsy();
    });

    it('should call getBackgroundUrl', () => {
      expect(mockBackgroundService.getBackgroundUrl).toHaveBeenCalledWith(backgroundModel.location);
    });

    it('should call getBackgroundImage', () => {
      expect(mockBackgroundService.getBackgroundImage).toHaveBeenCalledWith(backgroundLinkModel.url);
    });

    describe('when setTimeout is reached', () => {
      beforeEach(() => {
        jasmine.clock().tick(300);
      });

      it('should set backgroundInfo\'s data and location', () => {
        expect(component.backgroundInfo.data).toBe(null);
        expect(component.backgroundInfo.location).toBe(backgroundLinkModel.location);
      });

      it('should call reader.readAsDataURL with the new data', () => {
        expect(mockFileReaderService.readAsDataURL).toHaveBeenCalledWith(backgroundDataBlob);
      });
    });
  });

  describe('setContentBlocks', () => {
    let contentBlockModel: ContentBlockModel;

    beforeEach(() => {
      contentBlockModel = {
        name: 'Test',
        url: 'https://example.com/',
        icon: 'test'
      };
      spyOn(mockContentBlocksService, 'getContentBlocks').and.returnValue(of([contentBlockModel]));
      component.setContentBlocks();
    });

    it('should call getContentBlocks', () => {
      expect(mockContentBlocksService.getContentBlocks).toHaveBeenCalled();
    });

    it('should set contentBlocks', () => {
      expect(component.contentBlocks).toEqual([contentBlockModel]);
    });
  });
});
