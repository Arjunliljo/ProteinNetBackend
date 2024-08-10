import twilio from "twilio";
import { configDotenv } from "dotenv";
configDotenv();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

export function otpToPhone(phoneNumber) {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  client.messages
    .create({
      body: `Your verification code is ${otp}`,
      from: "6238533609", // Your Twilio number
      to: phoneNumber, // User's phone number
    })
    .then((message) => console.log(`OTP sent with SID: ${message.sid}`))
    .catch((error) => console.error(`Failed to send OTP: ${error}`));

  return otp; // Return the OTP for further processing (e.g., saving to the database)
}
