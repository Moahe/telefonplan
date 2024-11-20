import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimesTable from "./components/TrainTimesTable";
import { TrainTimes } from "./components/itraintime";
import { Router, useRouter } from "next/router";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

async function fetchSLData(siteId: number) {
  const apiKey = process.env.SL_API_KEY;

  if (apiKey) {
    return fetch(
      `https://transport.integration.sl.se/v1/sites/${siteId}/departures?transport=METRO&forecast=60`, //`https://api.sl.se/api2/realtimedeparturesV4.json?siteid=${siteId}&timewindow=50&key=${apiKey}`,
      { cache: "no-store" }
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any) => {
        // if (data?.ResponseData.length === 0) {
        //   return data;
        // }
        console.log("RESPONSE1", new Date().toLocaleDateString());
        return data?.departures;
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
      });
  }
}

export default async function FlyWithUsPage({
  params,
}: {
  params: { locale: string };
}) {
  const trainTimes = await fetchSLData(9263);
  const southTrainTimes = await fetchSLData(9001);
  const errorCode = "" + trainTimes?.StatusCode + ": " + trainTimes?.Message;
  const northBoundTrainTimes =
    trainTimes?.filter((trainTime: any) => trainTime.direction_code === 1) ??
    [];

  const southBoundTrainTimes =
    southTrainTimes?.filter(
      (trainTime: any) =>
        trainTime.destination === "Fruängen" ||
        trainTime.destination === "Telefonplan"
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
      HEJ RASMUS
    </main>
  );
}

// export default async function Home() {
//   const callAPISouth = () => {
//     if (apiKey) {
//       return fetch(
//         `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9001&timewindow=50&key=${apiKey}`
//       )
//         .then((response) => {
//           if (!response.ok) {
//             console.log("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data: { ResponseData: TrainTimes }) => {
//           console.log("RESPONSE1", data);
//           return data.ResponseData;
//         })
//         .catch((error) => {
//           console.log("Error fetching data:", error.message);
//         });
//     }
//   };

//   const callAPI = () => {
//     if (apiKey) {
//       return fetch(
//         `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9263&timewindow=50&key=${apiKey}`,
//         { next: { revalidate: 160 } }
//       )
//         .then((response) => {
//           if (!response.ok) {
//             console.log("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data: any) => {
//           if (data?.ResponseData.Metros.length === 0) {
//             return data;
//           }
//           return data.ResponseData;
//         })
//         .catch((error) => {
//           console.log("Error fetching data:", error.message);
//         });
//     }
//   };
//   const trainTimes = await callAPI();
//   const southTrainTimes = await callAPISouth();
//   const errorCode = "" + trainTimes?.StatusCode + ": " + trainTimes?.Message;
//   const northBoundTrainTimes =
//     trainTimes?.Metros?.filter(
//       (trainTime: any) => trainTime.JourneyDirection === 1
//     ) ?? [];

//   const southBoundTrainTimes =
//     southTrainTimes?.Metros.filter(
//       (trainTime) =>
//         trainTime.Destination === "Fruängen" ||
//         trainTime.Destination === "Telefonplan"
//     ) ?? [];

//   return (
//     <main className={styles.main}>
//       <div className={styles.description}>
//         <TrainTimesTable
//           trainTimes={{
//             LatestUpdate: trainTimes?.LatestUpdate,
//             Metros: northBoundTrainTimes ?? [],
//           }}
//           trainTimesSouth={{
//             LatestUpdate: southTrainTimes?.LatestUpdate,
//             Metros: southBoundTrainTimes ?? [],
//           }}
//           error={errorCode}
//         />
//         <Link href="/test">
//           <button className={styles.description}>Click here!</button>
//         </Link>
//       </div>
//       HEJHOPP
//     </main>
//   );
// }
