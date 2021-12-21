import { Client } from "@sendgrid/client";

//? @sendgrid/client
export const client = new Client();
client.setApiKey(process.env.SENDGRID_API_KEY);
