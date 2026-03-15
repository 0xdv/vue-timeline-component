/**
 * Represents a time span with a start date and optional end date.
 *
 * @example
 * ```ts
 * const span = new TimelineSpan("Project", new Date("2020-01-01"), new Date("2021-01-01"));
 * ```
 */
export class TimelineSpan {
  /** Display name of the span. */
  name: string;
  /** Start date of the span. */
  start: Date;
  /** End date of the span (optional). */
  end?: Date;
  /** Duration in milliseconds (optional, derived from start/end). */
  duration?: number;
  /** Vertical lane level assigned during layout. */
  level?: number;
  /** Horizontal position assigned during layout. */
  position?: number;
  /** Fill color of the span rectangle (any valid CSS color string). */
  color?: string;

  constructor(name: string, start: Date, end?: Date) {
    this.name = name;
    this.start = start;
    this.end = end;
  }
}

/**
 * Represents a single point-in-time event on the timeline.
 *
 * @example
 * ```ts
 * const point = new TimelinePoint(new Date("2023-06-15"), "Release v1.0");
 * ```
 */
export class TimelinePoint {
  /** The date of the event. */
  date: Date;
  /** Human-readable description of the event. */
  description: string;
  /** Vertical lane level assigned during layout. */
  level?: number;
  /** Horizontal position assigned during layout. */
  position?: number;

  constructor(date: Date, description: string) {
    this.date = date;
    this.description = description;
  }
}

/** A union type representing either a {@link TimelineSpan} or a {@link TimelinePoint}. */
export type TimelineItem = TimelineSpan | TimelinePoint;

/**
 * Type guard that returns `true` when `item` is a {@link TimelinePoint}.
 *
 * @param item - The timeline item to check.
 */
export function isTimelinePoint(item: TimelineItem): item is TimelinePoint {
  return item instanceof TimelinePoint;
}

/**
 * Type guard that returns `true` when `item` is a {@link TimelineSpan}.
 *
 * @param item - The timeline item to check.
 */
export function isTimelineSpan(item: TimelineItem): item is TimelineSpan {
  return item instanceof TimelineSpan;
}

/** Pixel margins applied around the timeline SVG canvas. */
export interface TimelineMargin {
  /** Top margin in pixels. */
  top: number;
  /** Bottom margin in pixels. */
  bottom: number;
  /** Left margin in pixels. */
  left: number;
  /** Right margin in pixels. */
  right: number;
}

/** Configuration options for the {@link VueTimeline} component. */
export interface TimelineConfig {
  /** Fixed width of the SVG viewport in pixels. Defaults to the container width. */
  viewWidth?: number;
  /** Height of the SVG viewport in pixels. */
  viewHeight?: number;
  /** When `true`, the timeline redraws when the container is resized. */
  widthResizable?: boolean;
  /** Margin around the timeline drawing area. */
  margin?: TimelineMargin;
  /** Callback fired when the user clicks a span or point. */
  onClick?: (item: TimelineSpan | TimelinePoint) => void;
  /** Show a vertical cursor line that follows the mouse. */
  showCursor?: boolean;
  /** Show vertical grid lines aligned with axis ticks. */
  showGrid?: boolean;
  /** Label century axis ticks using Roman numerals. */
  romanCenturies?: boolean;
  /** Maximum number of layout levels (default: 15). Controls how many rows spans can occupy. */
  maxLevel?: number;
}
