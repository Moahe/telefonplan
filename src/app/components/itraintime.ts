export interface TrainTimesResult {
  trainTimes: TrainTimes;
  trainTimesSouth: TrainTimes;
  error: string;
}

export interface ReseBotTrainTimesResult {
  trainTimes: ReseBotTrainTimes[];
  trainTimesSouth: ReseBotTrainTimes[];
  error: string;
}

export interface ReseBotTrainTimes {
  name: string;
  direction: string;
  time: string;
}

export interface TrainTimes {
  Metros: TrainTime[];
  LatestUpdate?: string;
  length?: number;
}

export interface TrainTime {
  destination: string; // Destination name
  deviations: any[]; // Deviations array
  direction: string; // Direction name
  direction_code: number; // Direction code
  display: string; // Display time (e.g., "7 min")
  expected: string; // Expected arrival time
  journey: {
    id: number; // Journey ID
    state: string; // State of the journey (e.g., "NORMALPROGRESS")
    prediction_state: string; // Prediction state (e.g., "NORMAL")
  };
  line: {
    id: number; // Line ID
    designation: string; // Line designation (e.g., "14")
    transport_mode: string; // Mode of transport (e.g., "METRO")
    group_of_lines: string; // Group of lines (e.g., "Tunnelbanans röda linje")
  };
  scheduled: string; // Scheduled arrival time
  state: string; // Current state (e.g., "EXPECTED")
  stop_area: {
    id: number; // Stop area ID
    name: string; // Stop area name
    type: string; // Stop area type (e.g., "METROSTN")
  };
  stop_point: {
    designation: string; // Stop point designation (e.g., "1")
    id: number; // Stop point ID
    name: string; // Stop point name
  };
}

// export interface TrainTime {
//   GroupOfLine: string;
//   DisplayTime: string;
//   TransportMode: string;
//   LineNumber: string;
//   Destination: string;
//   JourneyDirection: number;
//   StopAreaName: string;
//   StopAreaNumber: number;
//   StopPointNumber: number;
//   StopPointDesignation: string;
//   TimeTabledDateTime: string;
//   ExpectedDateTime: string;
//   JourneyNumber: number;
//   Deviations: null | string;
// }
