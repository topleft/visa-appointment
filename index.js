require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

TWILIO_ID = process.env.TWILIO_ID;
TWILIO_TOKEN = process.env.TWILIO_TOKEN;
APPOINTMENT_ENDPOINT = process.env.APPOINTMENT_ENDPOINT;
RECIPIENT_PHONE_NUMBER = process.env.RECIPIENT_PHONE_NUMBER;
SENDER_PHONE_NUMBER = process.env.SENDER_PHONE_NUMBER;
LOG_FILE = process.env.LOG_FILE;

const twilio = require('twilio')(TWILIO_ID, TWILIO_TOKEN);

  /////////////////////
 // -- HELPERS ---- //
/////////////////////

const log = (info) => {
  const formattedInfo = `
    -------------------------
    ${info}
    Run time: ${new Date().toString()}
    -------------------------
  `;
  fs.exists(LOG_FILE, exists => {
    if (!exists) {
      fs.writeFile(LOG_FILE, null, err => err && console.error);
    }
    fs.appendFile(LOG_FILE, formattedInfo, err => err && console.error);
  });
};

const getDataFromResponseBody = body => {
  const start = body.indexOf('(') + 1;
  const end = body.length -2;
  const dataString = body.substring(start, end);
  return JSON.parse(dataString);
};

const findEarliestAppointments = (data) => {
  const availability = data['Slots'].filter((day) => {
    return day.availabletime.length
  });
  return availability;
};

const sendText = (body) => {
  twilio.messages
    .create({
       body: body,
       from: SENDER_PHONE_NUMBER,
       to: RECIPIENT_PHONE_NUMBER
     })
    .then(message => console.log(message.sid))
    .done();
};

const handleScheduleData = (response) => {
  const available = findEarliestAppointments(getDataFromResponseBody(response.data));
  let logInfo;
  if (available.length) {
    logInfo = `
      Found earlier appointment!
      ${JSON.stringify(available)}
    `;
    const message = JSON.stringify(available);
    sendText(message);
  } else {
    logInfo = `...NO appointments found.`;
  }
  log(logInfo);
};

const main = () => {
  axios({
    method: 'get',
    url: `${APPOINTMENT_ENDPOINT}${Date.now()}`
  })
  .then(handleScheduleData)
  .catch(log);
};

main();
