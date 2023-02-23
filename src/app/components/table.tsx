"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface TrainTimesResult {
  trainTimes: TrainTimes;
}

interface TrainTimes {
  Metros: TrainTime[];
  LatestUpdate: string;
  length?: number;
}

interface TrainTime {
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

function formatTime(timeString: string) {
  const date = new Date(timeString);
  const formattedTime = date.toLocaleTimeString("sv-SE", {
    timeZone: "Europe/Stockholm",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formattedTime;
}

export default function TrainTimes(trainTimes: TrainTimesResult) {
  const router = useRouter();
  const [trainTime, setTrainTime] = React.useState<TrainTimes>(
    trainTimes.trainTimes
  );
  const morbyCentrumTrainTimes = trainTime?.Metros.filter(
    (trainTime) => trainTime.Destination === "Mörby centrum"
  );

  useEffect(() => {
    if (trainTimes.trainTimes.length === 0) {
      return;
    }
    setTrainTime(trainTimes.trainTimes);
  }, [trainTimes]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>
        Updated:{" "}
        {trainTime?.Metros?.length === 0
          ? ""
          : formatTime(trainTime?.LatestUpdate)}
      </p>
      {trainTime.length && trainTime.length < 2 ? (
        <p>No trains</p>
      ) : (
        <ul style={listStyle}>
          {morbyCentrumTrainTimes?.map((train: TrainTime, index: number) => (
            <li key={index} style={listItemStyle}>
              <p style={headerStyle}>
                {train.GroupOfLine} {train.LineNumber}
              </p>
              <p style={bodyStyle}>{train.Destination}</p>
              <p style={bodyStyle}>{train.DisplayTime}</p>
              <p style={bodyStyle}>
                <span style={{ fontWeight: "300", color: "gray" }}>
                  Scheduled time:
                </span>{" "}
                {formatTime(train.TimeTabledDateTime)}
              </p>
              <p style={bodyStyle}>
                <span style={{ fontWeight: "300", color: "gray" }}>
                  Expected time:
                </span>{" "}
                {formatTime(train.ExpectedDateTime)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const listStyle = {
  listStyleType: "none",
  paddingLeft: "0",
};
const listItemStyle = {
  padding: "10px",
  margin: "10px 0",
  backgroundColor: "rgb(94,94,94, 0.4)",
  borderRadius: "5px",
};
const headerStyle = {
  marginBottom: "5px",
  fontWeight: "bold",
  border: "1px solid transparent",
};
const bodyStyle = {
  margin: "0",
  border: "1px solid transparent",
  backgroundColor: "transparent",
};
