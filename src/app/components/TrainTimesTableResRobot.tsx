"use client";
import React, { useState } from "react";
import { ReseBotTrainTimesResult, ReseBotTrainTimes } from "./itraintime";
import SoundPlayer from "./SoundPlayer";
import styles from "../page.module.css";
import "../globals.css";

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

export default function TrainTimesTableResRobot({
  trainTimes,
  trainTimesSouth,
  error,
}: ReseBotTrainTimesResult) {
  const onServer = typeof window === `undefined`;

  const [isTrainTimesVisible, setIsTrainTimesVisible] = useState(false);

  const toggleTrainTimes = () => {
    setIsTrainTimesVisible((prevState) => !prevState);
  };

  return (
    <main className={styles.main} style={{ backgroundColor: "black" }}>
      <div className={styles.description}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: "10px",
            }}
            onClick={toggleTrainTimes}
          >
            <h1>
              Next train{" "}
              {isTrainTimesVisible ? "Tc to Telefonplan" : "to Mörby centrum"}
            </h1>
            <span
              style={{
                display: "inline-block",
                transform: isTrainTimesVisible
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s ease",
                marginLeft: "10px",
              }}
            >
              &#9660;
            </span>
          </div>
          {trainTimes && trainTimes.length ? (
            <>
              {/* Remove the existing "Updated" paragraph */}
              <SoundPlayer audioFile="/music/song1.mp3">
                <ul style={listStyle}>
                  {trainTimes.map((train: ReseBotTrainTimes, index: number) => (
                    <li key={index} style={listItemStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(20, 20, 20, 0.5)",
                        }}
                      >
                        <p style={headerStyle}>{train.direction}</p>
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

                        <p style={bodyStyle}>{train.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </SoundPlayer>
            </>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <p>Loading train times... {trainTimes?.length}</p>
          )}
        </div>
      </div>
    </main>
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
  color: "white",
};
const bodyStyle = {
  margin: "0",
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "white",
};
