"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

// Define the audio file you want to play
const audioFile = "https://telefonplan.vercel.app/song1.mp3";

//const audio = new Audio("/song1");

//import audioFile from "../../../public/song1.mp3";

// Define a new Audio object to play the sound
//const audio = "";

interface TrainTimesResult {
  trainTimes: TrainTimes;
}

export interface TrainTimes {
  Metros: TrainTime[];
  LatestUpdate?: string;
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

export default function TrainTimesTable({ trainTimes }: TrainTimesResult) {
  const [playSong, setPlaySong] = useState(false);
  const router = useRouter();
  const [trainTime, setTrainTime] = useState(trainTimes);
  const morbyCentrumTrainTimes = trainTime?.Metros.filter(
    (trainTime) => trainTime.Destination === "Mörby centrum"
  );

  useEffect(() => {
    if (trainTimes.length === 0) {
      return;
    }
    setTrainTime(trainTimes);
  }, [trainTimes]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 40000);
    return () => clearInterval(interval);
  }, []);

  // Define a function to play the sound when a list item is clicked
  const handleClick = () => {
    if (playSong) {
      //audio?.pause();
      setPlaySong(false);
    } else {
      setPlaySong(true);
      //audio?.play();
    }
  };

  return (
    <div>
      <audio src="/music/song1.mp3" controls>
        The file
      </audio>
      {trainTime?.Metros.length ? (
        <>
          <p style={{ padding: "10px 0", color: "grey" }}>
            Updated:{" "}
            {trainTime?.Metros?.length === 0
              ? ""
              : formatTime(trainTime?.LatestUpdate ?? "")}
          </p>
          {trainTime.length && trainTime.length < 2 ? (
            <p>No trains</p>
          ) : (
            <ul style={listStyle}>
              {morbyCentrumTrainTimes?.map(
                (train: TrainTime, index: number) => (
                  <li
                    key={index}
                    style={listItemStyle}
                    onClick={handleClick} // Attach the onClick event handler to the list item
                  >
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

                      <p style={headerStyle}>{train.DisplayTime}</p>
                    </div>
                    <div
                      style={{
                        fontWeight: "300",
                        color: "gray",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ width: "150px" }}>Scheduled time:</span>
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
                      <span style={{ width: "150px" }}>Expected time:</span>{" "}
                      <p style={bodyStyle}>
                        {formatTime(train.ExpectedDateTime)}
                      </p>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
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
