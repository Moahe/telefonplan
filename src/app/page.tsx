import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import TrainTimesTable, { TrainTimes } from "./components/TrainTimesTable";

const inter = Inter({ subsets: ["latin"] });

const apiKey = process.env.SL_API_KEY;

export default async function Home() {
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
          //console.log("RESPONSE", data.ResponseData);
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

const mockData = {
  Metros: [
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "Nu",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Fruängen",
      JourneyDirection: 2,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2822,
      StopPointDesignation: "2",
      TimeTabledDateTime: "2023-02-23T22:14:00",
      ExpectedDateTime: "2023-02-23T22:14:00",
      JourneyNumber: 20573,
      Deviations: null,
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "10 min",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Mörby centrum",
      JourneyDirection: 1,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2821,
      StopPointDesignation: "1",
      TimeTabledDateTime: "2023-02-23T22:24:00",
      ExpectedDateTime: "2023-02-23T22:24:15",
      JourneyNumber: 20205,
      Deviations: null,
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "18 min",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Fruängen",
      JourneyDirection: 2,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2822,
      StopPointDesignation: "2",
      TimeTabledDateTime: "2023-02-23T22:29:00",
      ExpectedDateTime: "2023-02-23T22:31:56",
      JourneyNumber: 20575,
      Deviations: [Array],
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "22:39",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Mörby centrum",
      JourneyDirection: 1,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2821,
      StopPointDesignation: "1",
      TimeTabledDateTime: "2023-02-23T22:39:00",
      ExpectedDateTime: "2023-02-23T22:39:00",
      JourneyNumber: 20206,
      Deviations: null,
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "22:44",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Fruängen",
      JourneyDirection: 2,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2822,
      StopPointDesignation: "2",
      TimeTabledDateTime: "2023-02-23T22:44:00",
      ExpectedDateTime: "2023-02-23T22:44:00",
      JourneyNumber: 20577,
      Deviations: null,
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "22:54",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Mörby centrum",
      JourneyDirection: 1,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2821,
      StopPointDesignation: "1",
      TimeTabledDateTime: "2023-02-23T22:54:00",
      ExpectedDateTime: "2023-02-23T22:54:00",
      JourneyNumber: 20207,
      Deviations: null,
    },
    {
      GroupOfLine: "tunnelbanans röda linje",
      DisplayTime: "22:59",
      TransportMode: "METRO",
      LineNumber: "14",
      Destination: "Fruängen",
      JourneyDirection: 2,
      StopAreaName: "Telefonplan",
      StopAreaNumber: 2821,
      StopPointNumber: 2822,
      StopPointDesignation: "2",
      TimeTabledDateTime: "2023-02-23T22:59:00",
      ExpectedDateTime: "2023-02-23T22:59:00",
      JourneyNumber: 20578,
      Deviations: null,
    },
  ],
  LatestUpdate: "2023-02-23T22:14:00",
};
