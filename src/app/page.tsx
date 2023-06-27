import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimesTable from "./components/TrainTimesTable";
import { TrainTimes } from "./components/itraintime";

const inter = Inter({ subsets: ["latin"] });

const apiKey = process.env.SL_API_KEY;

export default async function Home() {
  const callAPISouth = () => {
    if (apiKey) {
      return fetch(
        `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9001&timewindow=50&key=${apiKey}`,
        { next: { revalidate: 80 } }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data: { ResponseData: TrainTimes }) => {
          console.log("RESPONSE1", data?.ResponseData?.LatestUpdate);
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
        { next: { revalidate: 60 } }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data: { ResponseData: TrainTimes }) => {
          console.log("RESPONSE", data?.ResponseData?.LatestUpdate);
          return data.ResponseData;
        })
        .catch((error) => {
          console.log("Error fetching data:", error.message);
        });
    }
  };
  const trainTimes = await callAPI();
  const southTrainTimes = await callAPISouth();

  const northBoundTrainTimes =
    trainTimes?.Metros.filter(
      (trainTime) => trainTime.JourneyDirection === 1
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
        />
      </div>
    </main>
  );
}
