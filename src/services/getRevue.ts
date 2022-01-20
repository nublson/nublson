import axios from "axios";
import https from "https";

const revue = axios.create({
  baseURL: "https://www.getrevue.co/api/v2",
  timeout: 60000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    Authorization: `Token ${process.env.REVUE_API_KEY}`,
  },
});

export const getIssues = async () => {
  const response = await revue.get("/issues");

  return response;
};

export const getSubscribers = async () => {
  const response = await revue.get("/subscribers");

  return response;
};

export const addSubscriber = async (email: string) => {
  const response = await revue.post("/subscribers", {
    email,
  });

  return response;
};
