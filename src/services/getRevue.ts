import axios from "axios";
import https from "https";

export const revue = axios.create({
  baseURL: "https://www.getrevue.co/api/v2",
  timeout: 60000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    Authorization: `Token ${process.env.REVUE_API_KEY}`,
  },
});
