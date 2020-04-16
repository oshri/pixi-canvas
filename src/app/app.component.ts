import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
  HostListener,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";
import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Observable, of, BehaviorSubject } from "rxjs";
import { untilDestroyed } from "ngx-take-until-destroy";

export interface IPixiApplicationOptions {
  autoStart?: boolean;
  width?: number;
  height?: number;
  view?: HTMLCanvasElement;
  transparent?: boolean;
  autoDensity?: boolean;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  resolution?: number;
  forceCanvas?: boolean;
  backgroundColor?: number;
  clearBeforeRender?: boolean;
  forceFXAA?: boolean;
  powerPreference?: string;
  sharedTicker?: boolean;
  sharedLoader?: boolean;
  resizeTo?: Window | HTMLElement;
}

@Component({
  selector: "app-root",
  styleUrls: ["./app.component.scss"],
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public app: Application;

  @Input()
  public devicePixelRatio = window.devicePixelRatio || 1;

  @Input()
  public applicationOptions: IPixiApplicationOptions = {};

  constructor(private elementRef: ElementRef, private ngZone: NgZone) {}

  init() {
    this.ngZone.runOutsideAngular(() => {
      this.app = new Application(this.applicationOptions);
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
    this.resize();
  }

  ngOnInit(): void {
    this.init();
  }

  @HostListener("window:resize")
  public resize() {
    const width = this.elementRef.nativeElement.offsetWidth;
    const height = this.elementRef.nativeElement.offsetHeight;
    const viewportScale = 1 / this.devicePixelRatio;
    this.app.renderer.resize(
      width * this.devicePixelRatio,
      height * this.devicePixelRatio
    );
    this.app.view.style.transform = `scale(${viewportScale})`;
    this.app.view.style.transformOrigin = `top left`;
  }

  destroy() {
    this.app.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
