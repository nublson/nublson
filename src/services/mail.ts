import axios from "axios";

const mail = axios.create({
  baseURL: `https://api.sendgrid.com/v3`,
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
  },
});

export default mail;
