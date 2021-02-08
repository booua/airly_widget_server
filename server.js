require("dotenv").config();
var Mixpanel = require('mixpanel');
const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");

const resolvers = {
  Query: {
    nearestMeasurement: (parent, args) => {
      const { lat, lng } = args;
      return getAirlyData(
        `https://airapi.airly.eu/v2/measurements/point?lat=${lat}&lng=${lng}&maxDistanceKM=5`
      );
    },
    nearestInstallation: (parent, args) => {
      const { lat, lng } = args;
      return getAirlyData(`https://airapi.airly.eu/v2/installations/nearest?lat=${lat}&lng=${lng}&maxDistanceKM=5`);
    },
  },
};

// ANALYTICS_KEY

const server = new GraphQLServer({ typeDefs: "./airly.graphql", resolvers });

 let mixpanel = Mixpanel.init(
  process.env.ANALYTICS_KEY,
  {
    host: "api-eu.mixpanel.com",
  },
);

async function getAirlyData(url = "") {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.AIRLY_API_KEY,
    },
  });
  mixpanel.track("airly request made", {"url": url, "response": response.json()});
  return response.json();
}

server.start(() => {
mixpanel.track("Server started");
console.log('started on 4000')
});