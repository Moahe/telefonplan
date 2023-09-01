import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimesTable from "./components/TrainTimesTable";
import { TrainTimes } from "./components/itraintime";
import { Router, useRouter } from "next/router";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const apiKey = process.env.SL_API_KEY;

export default async function Home() {
  const callAPISouth = () => {
    if (apiKey) {
      return fetch(
        `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9001&timewindow=50&key=${apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data: { ResponseData: TrainTimes }) => {
          console.log("RESPONSE1", data);
          return data.ResponseData;
        })
        .catch((error) => {
          console.log("Error fetching data:", error.message);
        });
    }
  };

  const callAPI = () => {
    if (apiKey) {
      return fetch(
        `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9263&timewindow=50&key=${apiKey}`,
        { next: { revalidate: 160 } }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data: any) => {
          if (data?.ResponseData.Metros.length === 0) {
            return data;
          }
          return data.ResponseData;
        })
        .catch((error) => {
          console.log("Error fetching data:", error.message);
        });
    }
  };
  const trainTimes = await callAPI();
  const southTrainTimes = await callAPISouth();
  const errorCode = "" + trainTimes?.StatusCode + ": " + trainTimes?.Message;
  const northBoundTrainTimes =
    trainTimes?.Metros?.filter(
      (trainTime: any) => trainTime.JourneyDirection === 1
    ) ?? [];

  const southBoundTrainTimes =
    southTrainTimes?.Metros.filter(
      (trainTime) =>
        trainTime.Destination === "Fruängen" ||
        trainTime.Destination === "Telefonplan"
    ) ?? [];

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <TrainTimesTable
          trainTimes={{
            LatestUpdate: trainTimes?.LatestUpdate,
            Metros: northBoundTrainTimes ?? [],
          }}
          trainTimesSouth={{
            LatestUpdate: southTrainTimes?.LatestUpdate,
            Metros: southBoundTrainTimes ?? [],
          }}
          error={errorCode}
        />
        <Link href="/test">
          <button className={styles.description}>Click here!</button>
        </Link>
      </div>
    </main>
  );
}
