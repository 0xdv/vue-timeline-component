export interface TimelineEvent {
  name: string;
  start: Date;
  end?: Date;
  duration?: number;
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
  onEventClick?: (event: TimelineEvent) => void;
  showCursor?: boolean;
  romanCenturies?: boolean;
}
