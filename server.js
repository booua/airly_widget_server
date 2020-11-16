require("dotenv").config();
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
    installation: (parent, args) => {
      console.log("test");
      const { id } = args;
      return getAirlyData(`https://airapi.airly.eu/v2/installations/${id}`);
    },
  },
};

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

server.start(() => console.log("Server is running on localhost:4000"));


// nearestMeasurement(geolocation: Geolocation): Measurement
//installations nearby
//all measurements for id
//measurements by name for id

//get location from electron