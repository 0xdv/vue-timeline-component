export class TimelineSpan {
  name: string;
  start: Date;
  end?: Date;
  duration?: number;
  level?: number;
  position?: number;

  constructor(name: string, start: Date, end?: Date) {
    this.name = name;
    this.start = start;
    this.end = end;
  }
}

export class TimelinePoint {
  date: Date;
  description: string;
  level?: number;
  position?: number;

  constructor(date: Date, description: string) {
    this.date = date;
    this.description = description;
  }
}

export type TimelineItem = TimelineSpan | TimelinePoint;

export function isTimelinePoint(item: TimelineItem): item is TimelinePoint {
  return item instanceof TimelinePoint;
}

export function isTimelineSpan(item: TimelineItem): item is TimelineSpan {
  return item instanceof TimelineSpan;
}

export interface TimelineMargin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TimelineConfig {
  viewWidth?: number;
  viewHeight?: number;
  widthResizable?: boolean;
  margin?: TimelineMargin;
  onClick?: (item: TimelineSpan | TimelinePoint) => void;
  showCursor?: boolean;
  romanCenturies?: boolean;
}
