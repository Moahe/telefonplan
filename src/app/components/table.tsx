"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface TrainTimes {
  trainTimes: TrainTime[];
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
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return formattedTime;
}

export default function TrainTimes(trainTimes: TrainTimes) {
  const router = useRouter();
  const trainTime = trainTimes.trainTimes;
  const morbyCentrumTrainTimes = trainTime.filter(
    (trainTime) => trainTime.Destination === "Mörby centrum"
  );
  const currentTime = new Date().toUTCString();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  console.log("trainTimes", trainTimes);

  return (
    <div>
      {trainTimes.length && trainTimes.length < 2 ? (
        <p>No trains</p>
      ) : (
        <ul style={listStyle}>
          {morbyCentrumTrainTimes?.map((train, index) => (
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
                  Excepted time:
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
