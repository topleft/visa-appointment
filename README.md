A script to look for appointments at the Spanish Consulate in Los Angeles.


ENV vars:

```
TWILIO_ID=<update>
TWILIO_TOKEN=<update>
RECIPIENT_PHONE_NUMBER=<update>
SENDER_PHONE_NUMBER=<update>
APPOINTMENT_ENDPOINT=https://app.bookitit.com/onlinebookings/datetime/?callback=jQuery211004125129503924718_1527532344136&type=default&publickey=275f65e80ce06aaf5cd24cebd11311897&lang=en&services%5B%5D=bkt277112&agendas%5B%5D=bkt128876&src=https%3A%2F%2Fapp.bookitit.com%2Fen%2Fhosteds%2Fwidgetdefault%2F&srvsrc=https%3A%2F%2Fapp.bookitit.com&version=161778911&start=2018-06-01&end=2018-07-24&selectedPeople=1&_=
LOG_FILE=log.txt

```

The time window in which appointments are searched for is clearly stated in the `APPOINTMENT_ENDPOINT` as query params labeled `start` and `end`.
