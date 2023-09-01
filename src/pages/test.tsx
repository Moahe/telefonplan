import TrainTimesTableResRobot from "@/app/components/TrainTimesTableResRobot";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "../app/page.module.css";

export default function Test() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the API URL
    const apiUrl = "https://slsubway.vercel.app/api/data";

    // Make the API call using Axios
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API response:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  // Use the API data in your component
  return (
    <div
      style={{
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {data ? (
        <TrainTimesTableResRobot
          trainTimes={data}
          trainTimesSouth={[]}
          error={""}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

const boxStyle = {
  backgroundColor: "black",
  height: "100%",
  width: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};
