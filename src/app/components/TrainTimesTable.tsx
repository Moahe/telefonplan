"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TrainTimesResult, TrainTime } from "./itraintime";

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

export default function TrainTimesTable({ trainTimes }: TrainTimesResult) {
  const [playSong, setPlaySong] = useState(false);
  const router = useRouter();
  const [trainTime, setTrainTime] = useState(trainTimes);
  const morbyCentrumTrainTimes = trainTime?.Metros.filter(
    (trainTime) => trainTime.Destination === "Mörby centrum"
  );

  const dateLessThan10Minutes = (date: Date | string) => {
    // @ts-expect-error
    var date = new Date(date);
    var now = new Date();
    var timeDifference = now.getTime() - date.getTime();
    if (timeDifference < 600000) {
      console.log("The date is less than 10 minutes old.", trainTimes);
      return true;
    } else {
      console.log("The date is older than 10 minutes.");
      return false;
    }
  };

  const audio = useRef<HTMLAudioElement | undefined>();

  useEffect(() => {
    audio.current =
      typeof Audio !== undefined ? new Audio("/music/song1.mp3") : undefined;
  }, []);

  useEffect(() => {
    if (trainTimes.Metros?.length === 0) {
      return;
    }
    if (dateLessThan10Minutes(trainTime.Metros[0]?.ExpectedDateTime ?? "")) {
      setTrainTime(trainTimes);
    } else {
      console.log("REFRESHING");
      setInterval(
        () => {
          router.refresh();
        },
        trainTime.Metros?.length === 0 ? 5000 : 5000
      );
    }
  }, [trainTimes]);

  // useEffect(() => {
  //   const interval = setInterval(
  //     () => {
  //       router.refresh();
  //     },
  //     trainTime.Metros?.length === 0 ? 5000 : 5000
  //   );
  //   return () => clearInterval(interval);
  // }, []);

  const handleClick = () => {
    if (playSong) {
      audio.current?.pause();
      setPlaySong(false);
    } else {
      setPlaySong(true);
      audio.current?.play();
    }
  };

  const checkIfTrainIsLate = (train: TrainTime) => {
    const expectedTime = new Date(train.ExpectedDateTime);
    const timeTabledTime = new Date(train.TimeTabledDateTime);
    const diff = expectedTime.getTime() - timeTabledTime.getTime();
    return diff > 0 ? diff / 1000 : 0;
  };

  return (
    <div>
      {trainTime?.Metros.length ? (
        <>
          <p style={{ padding: "10px 0", color: "grey" }}>
            Updated:{" "}
            {trainTime?.Metros?.length === 0
              ? ""
              : formatTime(trainTime?.LatestUpdate ?? "")}
          </p>
          <ul style={listStyle}>
            {morbyCentrumTrainTimes?.map((train: TrainTime, index: number) => (
              <li key={index} style={listItemStyle} onClick={handleClick}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(20, 20, 20, 0.5)",
                  }}
                >
                  <p style={headerStyle}>
                    {train.LineNumber + " " + train.Destination}
                  </p>
                  <p style={headerStyle}>{}</p>
                </div>
                <div
                  style={{
                    fontWeight: "300",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ width: "150px", paddingLeft: "5px" }}>
                    Scheduled time:
                  </span>
                  <p style={bodyStyle}>
                    {formatTime(train.TimeTabledDateTime)}
                  </p>
                </div>
                <div
                  style={{
                    fontWeight: "300",
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ width: "150px", paddingLeft: "5px" }}>
                    Expected time:
                  </span>{" "}
                  <p
                    style={{
                      ...bodyStyle,
                      color: checkIfTrainIsLate(train) ? "orange" : "white",
                    }}
                  >
                    {formatTime(train.ExpectedDateTime)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading train times...</p>
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
  border: "1px solid transparent",
  backgroundColor: "transparent",
};
const bodyStyle = {
  margin: "0",
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "white",
};
