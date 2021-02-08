require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const fetch = require("node-fetch");
const Mixpanel = require('mixpanel');

let mixpanel = Mixpanel.init(process.env.ANALYTICS_KEY);

const resolvers = {
  Query: {
    nearestMeasurement: (parent, args) => {
      const { lat, lng } = args;
      mixpanel.track("airly request nearestMeasurement", {"lat": lat, "lng": lng});
      return getAirlyData(
        `https://airapi.airly.eu/v2/measurements/point?lat=${lat}&lng=${lng}&maxDistanceKM=5`
      );
    },
    nearestInstallation: (parent, args) => {
      const { lat, lng } = args;
      mixpanel.track("airly request nearestInstallation", {"lat": lat, "lng": lng});
      return getAirlyData(`https://airapi.airly.eu/v2/installations/nearest?lat=${lat}&lng=${lng}&maxDistanceKM=5`);
    },
  },
};

// ANALYTICS_KEY

const server = new GraphQLServer({ typeDefs: "./airly.graphql", resolvers });


async function getAirlyData(url = "") {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.AIRLY_API_KEY,
    },
  });
  return response.json();
}

server.start(() => {
mixpanel.track("Server started");
console.log('started on 4000')
});