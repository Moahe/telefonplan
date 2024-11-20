"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TrainTimesResult, TrainTime } from "./itraintime";
import SoundPlayer from "./SoundPlayer";

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

export default function TrainTimesTable({
  trainTimes,
  trainTimesSouth,
  error,
}: TrainTimesResult) {
  const onServer = typeof window === `undefined`;

  const [isTrainTimesVisible, setIsTrainTimesVisible] = useState(false);

  const toggleTrainTimes = () => {
    setIsTrainTimesVisible((prevState) => !prevState);
  };

  const router = useRouter();
  const [clientTrainTime, setTrainTime] = useState(trainTimes);

  console.log("clientTrainTime", clientTrainTime, trainTimes.Metros);

  const dateLessThan10Minutes = (date: Date | string) => {
    if (!onServer && date) {
      // @ts-expect-error
      var date = new Date(date);
      var now = new Date();
      var timeDifference = now.getTime() - date.getTime();
      if (timeDifference < 600000) {
        console.log("The date is less than 10 minutes old.", trainTimes);
        return true;
      } else {
        console.log("The date is older than 10 minutes.", trainTimes);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    if (trainTimes.Metros?.length) {
      // if (dateLessThan10Minutes(trainTimes?.LatestUpdate ?? "")) {
      //   console.log("The date is less than 10 minutes old.", trainTimes);
      setTrainTime(isTrainTimesVisible ? trainTimesSouth : trainTimes);
      // } else {
      //   console.log("The date is older than 10 minutes.", trainTimes);
      // }
    }
  }, [trainTimes]);

  useEffect(() => {
    if (isTrainTimesVisible) {
      setTrainTime(trainTimesSouth);
    } else {
      setTrainTime(trainTimes);
    }
  }, [isTrainTimesVisible]);

  useEffect(() => {
    const refreshTrainTime = () => {
      router.refresh();
    };
    const delay = 10200;
    const interval = setInterval(refreshTrainTime, delay);
    return () => clearInterval(interval);
  }, [trainTimes]);

  const checkIfTrainIsLate = (train: TrainTime) => {
    const expectedTime = new Date(train.expected);
    const timeTabledTime = new Date(train.scheduled);
    const diff = expectedTime.getTime() - timeTabledTime.getTime();
    return diff > 0 ? diff / 1000 : 0;
  };

  return (
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
            transform: isTrainTimesVisible ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            marginLeft: "10px",
          }}
        >
          &#9660;
        </span>
      </div>
      {trainTimes?.Metros ? (
        <>
          <p style={{ padding: "10px 0", color: "grey" }}>
            Updated:{" "}
            {clientTrainTime?.LatestUpdate
              ? formatTime(clientTrainTime.LatestUpdate)
              : ""}
          </p>
          <SoundPlayer audioFile="/music/song1.mp3">
            <ul style={listStyle}>
              {clientTrainTime?.Metros?.map(
                (train: TrainTime, index: number) => (
                  <>
                    <li key={index} style={listItemStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "rgba(20, 20, 20, 0.5)",
                        }}
                      >
                        <p style={headerStyle}>
                          {train.line.id + " " + train.destination}
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

                        <p style={bodyStyle}>{formatTime(train.scheduled)}</p>
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
                            color: checkIfTrainIsLate(train)
                              ? "orange"
                              : "white",
                          }}
                        >
                          {formatTime(train.expected)}
                        </p>
                      </div>
                    </li>
                  </>
                )
              )}
            </ul>
          </SoundPlayer>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading train times... {clientTrainTime?.Metros?.length}</p>
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
