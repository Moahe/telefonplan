import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimesTable from "./components/TrainTimesTable";
import { TrainTimes } from "./components/itraintime";

const inter = Inter({ subsets: ["latin"] });

const apiKey = process.env.SL_API_KEY;

export default async function Home() {
  const isServer = () => typeof window === `undefined`;
  const callAPI = () => {
    if (apiKey) {
      return fetch(
        `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9263&timewindow=50&key=${apiKey}`,
        { next: { revalidate: 600 } }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data: { ResponseData: TrainTimes }) => {
          console.log("RESPONSE", data.ResponseData);
          return data.ResponseData;
        })
        .catch((error) => {
          console.log("Error fetching data:", error.message);
        });
    }
  };
  const trainTimes = await callAPI();

  const northBoundTrainTimes =
    trainTimes?.Metros.filter(
      (trainTime) => trainTime.JourneyDirection === 1
    ) ?? [];

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Next train to Mörby centrum</h1>
        <TrainTimesTable
          trainTimes={{
            LatestUpdate: trainTimes?.LatestUpdate,
            Metros: northBoundTrainTimes ?? [],
          }}
        />
      </div>
    </main>
  );
}
