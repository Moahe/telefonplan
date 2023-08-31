export interface TrainTimesResult {
  trainTimes: TrainTimes;
  trainTimesSouth: TrainTimes;
  error: string;
}

export interface TrainTimes {
  Metros: TrainTime[];
  LatestUpdate?: string;
  length?: number;
}

export interface TrainTime {
  GroupOfLine: string;
  DisplayTime: string;
  TransportMode: string;
  LineNumber: string;
  Destination: string;
  JourneyDirection: number;
  StopAreaName: string;
  StopAreaNumber: number;
  StopPointNumber: number;
  StopPointDesignation: string;
  TimeTabledDateTime: string;
  ExpectedDateTime: string;
  JourneyNumber: number;
  Deviations: null | string;
}
