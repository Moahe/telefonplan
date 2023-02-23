// Client component
"use client";

import { use, useEffect } from "react";
import { callAPI, getApiStatus } from "@/pages/api/api";

export default function MyClientComponent() {
  const responseStatus = use(getApiStatus());
  const response = "";

  // const callTheAPI = () => {
  //   console.log("CALLING THE API");
  //   return use(callAPI(process.env.SL_API_KEY)) || {};
  // };

  // useEffect(() => {
  //   console.log("CALLING THE API");
  //   console.log("RESPONSE", response);
  // }, []);

  return <div>API Status: {responseStatus}</div>;
}
