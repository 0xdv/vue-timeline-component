export interface TimelineSpan {
  name: string;
  start: Date;
  end?: Date;
  duration?: number;
  level?: number;
  position?: number;
  [key: string]: unknown;
}

export interface TimelinePoint {
  date: Date;
  description: string;
  level?: number;
  position?: number;
  [key: string]: unknown;
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
