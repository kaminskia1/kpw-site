import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { ElementRef } from '@angular/core';
import { LandingComponent } from './landing.component';
import { BackgroundService } from '../../shared/services/background/background.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockBackgroundService: BackgroundService;
  let mockDocument: Document;

  beforeEach(async () => {
    mockBackgroundService = mock(BackgroundService);
    mockDocument = mock(Document);
    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      providers: [
        { provide: BackgroundService, useValue: instance(mockBackgroundService) },
        { provide: Document, useValue: instance(mockDocument) },
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
      spyOn(component, 'setBackground');
    });

    it('calls getBackground', () => {
      component.ngOnInit();
      expect(component.setBackground).toHaveBeenCalled();
    });
  });

  describe('setBackground', () => {

  });

  describe('onLoad', () => {
    beforeEach(() => {
      spyOn(component, 'updateBackgroundSize');
      component.pageLoaded = false;
      component.imageLoaded = false;
    });

    it('should load the page', () => {
      component.onLoad();
      expect(component.updateBackgroundSize).toHaveBeenCalled();
      expect(component.pageLoaded).toBeTruthy();
      expect(component.imageLoaded).toBeTruthy();
    });
  });

  describe('updateBackgroundSize', () => {
    beforeEach(() => {
      component.leftWidth = '50%';
      component.rightElement = { nativeElement: { offsetWidth: 100 } } as ElementRef;
    });

    describe('when defaultView is present', () => {
      it('updates the background width', () => {
        component.updateBackgroundSize();
        expect(component.leftWidth).not.toBe('50%');
      });
    });

    describe('when defaultView is not present', () => {
      it('does nothing', () => {
        expect(component.leftWidth).toBe('50%');
      });
    });
  });
});
