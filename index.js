require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_TOKEN);
const consulate = 'https://app.bookitit.com/en/hosteds/widgetdefault/275f65e80ce06aaf5cd24cebd11311897#selectservice/bkt277112';
const fs = require('fs');

  /////////////////////
 // -- HELPERS ---- //
/////////////////////

const log = (info) => {
  const logFile = process.env.LOG_FILE;
  const formattedInfo = `
    -------------------------
    ${info}
    Run time: ${new Date().toString()}
    -------------------------
  `;
  fs.exists(logFile, exists => {
    if (!exists) {
      fs.writeFile(logFile, null, err => err && console.error);
    }
    fs.appendFile(logFile, formattedInfo, err => err && console.error);
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
       from: '+14159917297',
       to: '+15102891955'
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
    url: `${process.env.APPOINTMENT_ENDPOINT}${Date.now()}`
  })
  .then(handleScheduleData)
  .catch(log);
};

main();
