// api.js
export function getApiStatus() {
  return fetch("https://dog.ceo/api/breeds/image/random").then((response) =>
    response.json().then((data) => data.status)
  );
}

export function callAPI(apiKey: string) {
  if (apiKey) {
    return fetch(
      `https://api.sl.se/api2/realtimedeparturesV4.json?siteid=9263&timewindow=30&key=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return data.status;
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
      });
  }
}
