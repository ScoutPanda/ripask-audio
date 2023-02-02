import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  NgZone, HostBinding, HostListener
} from "@angular/core";
import {normalizePassiveListenerOptions} from "@angular/cdk/platform";
import {DOCUMENT} from "@angular/common";

const activeEventOptions = normalizePassiveListenerOptions({passive: false});

/**
 * Allows users to select from a range of values by moving the slider thumb. It is similar in
 * behavior to the native `<input type="range">` element.
 */
@Component({
  selector: "app-player-slider",
  templateUrl: "player-slider.component.html",
  styleUrls: ["player-slider.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSliderComponent implements OnDestroy {
  @HostListener("focus")
  onFocus(): void {
    // We save the dimensions of the slider here, so we can use them to update the spacing of the
    // ticks and determine where on the slider click and slide events happen.
    this._sliderDimensions = this._getSliderDimensions();
  }

  @HostListener("mouseenter")
  onMouseenter(): void {
    if (this.disabled) {
      return;
    }

    // We save the dimensions of the slider here, so we can use them to update the spacing of the
    // ticks and determine where on the slider click and slide events happen.
    this._sliderDimensions = this._getSliderDimensions();
  }

  @HostBinding("attr.role") slider = "slider";

  @HostBinding("class._mat-animation-noopable")
  @HostBinding("class.mat-slider-horizontal")
  @HostBinding("class.mat-focus-indicator")
  @HostBinding("class.mat-slider")
  hostClasses = true;

  @HostBinding("class.mat-slider-disabled")
  get sliderDisabled(): boolean { return this.disabled; }

  @HostBinding("class.mat-slider-sliding")
  get sliderSliding(): boolean { return this._isSliding; }

  max = 1;
  min = 0;
  step = 0.0001;

  @Input() disabled = false;

  @Input()
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    if (v !== this._value) {
      this._value = v;
      this._percent = this._calculatePercentage(this._value);

      // Since this also modifies the percentage, we need to let the change detection know.
      this._changeDetectorRef.markForCheck();
    }
  }
  private _value = 0;

  /** Event emitted when the slider thumb moves. */
  @Output() readonly sliderChange: EventEmitter<number> = new EventEmitter<number>();

  /** set focus to the host element */
  focus(options?: FocusOptions): void {
    this._focusHostElement(options);
  }

  /** The percentage of the slider that coincides with the value. */
  get percent(): number { return this._clamp(this._percent); }
  private _percent = 0;

  /**
   * Whether the thumb is sliding.
   * Used to determine if there should be a transition for the thumb and fill track.
   */
  _isSliding = false;

  /** CSS styles for the track background element. */
  _getTrackBackgroundStyles(): { [key: string]: string } {
    return {
      // scale3d avoids some rendering issues in Chrome. See #12071.
      transform: `translateX(0) scale3d(${1 - this.percent}, 1, 1)`
    };
  }

  /** CSS styles for the track fill element. */
  _getTrackFillStyles(): { [key: string]: string } {
    return {
      // scale3d avoids some rendering issues in Chrome. See #12071.
      transform: `translateX(0) scale3d(${this.percent}, 1, 1)`
    };
  }

  /** The dimensions of the slider. */
  private _sliderDimensions: DOMRect | null = null;

  /** The value of the slider when the slide start event fires. */
  private _valueOnSlideStart: number | null = null;

  /** Reference to the inner slider wrapper element. */
  @ViewChild("sliderWrapper") private _sliderWrapper: ElementRef | undefined;

  /** Keeps track of the last pointer event that was captured by the slider. */
  private _lastPointerEvent: MouseEvent | TouchEvent | null = null;

  /** Used to subscribe to global move and end events */
  protected _document: Document;

  constructor(private _elementRef: ElementRef,
              private _changeDetectorRef: ChangeDetectorRef,
              private _ngZone: NgZone,
              @Inject(DOCUMENT) _document: Document) {
    this._document = _document;

    _ngZone.runOutsideAngular(() => {
      const element = _elementRef.nativeElement;
      element.addEventListener("mousedown", this._pointerDown, activeEventOptions);
      element.addEventListener("touchstart", this._pointerDown, activeEventOptions);
    });
  }

  ngOnDestroy(): void {
    const element = this._elementRef.nativeElement;
    element.removeEventListener("mousedown", this._pointerDown, activeEventOptions);
    element.removeEventListener("touchstart", this._pointerDown, activeEventOptions);
    this._lastPointerEvent = null;
    this._removeGlobalEvents();
  }

  /** Called when the user has put their pointer down on the slider. */
  private _pointerDown = (event: TouchEvent | MouseEvent): void => {
    // Don't do anything if the slider is disabled or the
    // user is using anything other than the main mouse button.
    if (this.disabled || this._isSliding || (!isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    this._ngZone.run(() => {
      const oldValue = this.value;
      const pointerPosition = getPointerPositionOnPage(event);
      this._isSliding = true;
      this._lastPointerEvent = event;
      event.preventDefault();
      this._focusHostElement();
      this.onMouseenter(); // Simulate mouseenter in case this is a mobile device.
      this._bindGlobalEvents(event);
      this._focusHostElement();
      this._updateValueFromPosition(pointerPosition);
      this._valueOnSlideStart = oldValue;

      // Emit a change and input event if the value changed.
      if (oldValue != this.value) {
        this._emitInputEvent();
      }
    });
  }

  /**
   * Called when the user has moved their pointer after
   * starting to drag. Bound on the document level.
   */
  private _pointerMove = (event: TouchEvent | MouseEvent): void => {
    if (this._isSliding) {
      // Prevent the slide from selecting anything else.
      event.preventDefault();
      const oldValue = this.value;
      this._lastPointerEvent = event;
      this._updateValueFromPosition(getPointerPositionOnPage(event));

      // Native range elements always emit `input` events when the value changed while sliding.
      if (oldValue != this.value) {
        this._emitInputEvent();
      }
    }
  }

  /** Called when the user has lifted their pointer. Bound on the document level. */
  private _pointerUp = (event: TouchEvent | MouseEvent): void => {
    if (this._isSliding) {
      event.preventDefault();
      this._removeGlobalEvents();
      this._isSliding = false;

      this._valueOnSlideStart = this._lastPointerEvent = null;
    }
  }

  /** Called when the window has lost focus. */
  private _windowBlur = (): void => {
    // If the window is blurred while dragging we need to stop dragging because the
    // browser won't dispatch the `mouseup` and `touchend` events anymore.
    if (this._lastPointerEvent) {
      this._pointerUp(this._lastPointerEvent);
    }
  }

  /** Use defaultView of injected document if available or fallback to global window reference */
  private _getWindow(): Window {
    return this._document.defaultView || window;
  }

  /**
   * Binds our global move and end events. They're bound at the document level and only while
   * dragging so that the user doesn't have to keep their pointer exactly over the slider
   * as they're swiping across the screen.
   */
  private _bindGlobalEvents(triggerEvent: TouchEvent | MouseEvent): void {
    // Note that we bind the events to the `document`, because it allows us to capture
    // drag cancel events where the user's pointer is outside the browser window.
    const document = this._document;
    const isTouch = isTouchEvent(triggerEvent);
    const moveEventName = isTouch ? "touchmove" : "mousemove";
    const endEventName = isTouch ? "touchend" : "mouseup";
    document.addEventListener(moveEventName, this._pointerMove, activeEventOptions);
    document.addEventListener(endEventName, this._pointerUp, activeEventOptions);

    if (isTouch) {
      document.addEventListener("touchcancel", this._pointerUp, activeEventOptions);
    }

    const window = this._getWindow();

    if (typeof window !== "undefined" && window) {
      window.addEventListener("blur", this._windowBlur);
    }
  }

  /** Removes any global event listeners that we may have added. */
  private _removeGlobalEvents(): void {
    const document = this._document;
    document.removeEventListener("mousemove", this._pointerMove, activeEventOptions);
    document.removeEventListener("mouseup", this._pointerUp, activeEventOptions);
    document.removeEventListener("touchmove", this._pointerMove, activeEventOptions);
    document.removeEventListener("touchend", this._pointerUp, activeEventOptions);
    document.removeEventListener("touchcancel", this._pointerUp, activeEventOptions);

    const window = this._getWindow();

    if (typeof window !== "undefined" && window) {
      window.removeEventListener("blur", this._windowBlur);
    }
  }

  /** Calculate the new value from the new physical location. The value will always be snapped. */
  private _updateValueFromPosition(pos: {x: number, y: number}): void {
    if (!this._sliderDimensions) {
      return;
    }

    const offset = this._sliderDimensions.left;
    const size = this._sliderDimensions.width;
    const posComponent = pos.x;

    // The exact value is calculated from the event and used to find the closest snap value.
    const percent = this._clamp((posComponent - offset) / size);

    // Since the steps may not divide cleanly into the max value, if the user
    // slid to 0 or 100 percent, we jump to the min/max value. This approach
    // is slightly more intuitive than using `Math.ceil` below, because it
    // follows the user's pointer closer.
    if (percent === 0) {
      this.value = this.min;
    } else if (percent === 1) {
      this.value = this.max;
    } else {
      const exactValue = this._calculateValue(percent);

      // This calculation finds the closest step by finding the closest
      // whole number divisible by the step relative to the min.
      const closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;

      // The value needs to snap to the min and max.
      this.value = this._clamp(closestValue, this.min, this.max);
    }
  }

  /** Emits an input event when the current value is different from the last emitted value. */
  private _emitInputEvent(): void {
    this.sliderChange.emit(this.value);
  }

  /** Calculates the percentage of the slider that a value is. */
  private _calculatePercentage(value: number | null): number {
    return ((value || 0) - this.min) / (this.max - this.min);
  }

  /** Calculates the value a percentage of the slider corresponds to. */
  private _calculateValue(percentage: number): number {
    return this.min + percentage * (this.max - this.min);
  }

  /** Return a number between two numbers. */
  private _clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Get the bounding client rect of the slider track element.
   * The track is used rather than the native element to ignore the extra space that the thumb can
   * take up.
   */
  private _getSliderDimensions(): DOMRect | null  {
    return this._sliderWrapper ? this._sliderWrapper.nativeElement.getBoundingClientRect() : null;
  }

  /**
   * Focuses the native element.
   * Currently only used to allow a blur event to fire but will be used with keyboard input later.
   */
  private _focusHostElement(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }
}

/** Returns whether an event is a touch event. */
function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  // This function is called for every pixel that the user has dragged, so we need it to be
  // as fast as possible. Since we only bind mouse events and touch events, we can assume
  // that if the event's name starts with `t`, it's a touch event.
  return event.type[0] === "t";
}

/** Gets the coordinates of a touch or mouse event relative to the viewport. */
function getPointerPositionOnPage(event: MouseEvent | TouchEvent): { x: number, y: number } {
  // `touches` will be empty for start/end events, so we have to fall back to `changedTouches`.
  const point = isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
  return {x: point.clientX, y: point.clientY};
}
