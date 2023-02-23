import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimes from "./components/table";

const inter = Inter({ subsets: ["latin"] });

const apiKey = process.env.SL_API_KEY;

export default async function Home() {
  const currentTime = new Date().toUTCString();
  const callAPI = () => {
    if (apiKey) {
      return fetch(
        `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9263&timewindow=30&key=${apiKey}`,
        { next: { revalidate: 60 } }
      )
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("RESPONSE", data.ResponseData.Metros.length);
          return data.ResponseData;
        })
        .catch((error) => {
          console.log("Error fetching data:", error.message);
        });
    }
  };
  const trainTimes = await callAPI();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Train Times</h1>
        <TrainTimes
          trainTimes={{
            LatestUpdate: trainTimes.LatestUpdate,
            Metros: trainTimes.Metros,
          }}
        />
      </div>
    </main>
  );
}
