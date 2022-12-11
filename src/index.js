'use strict';
const got = require('got');
const commander = require('commander');
const _ = require('lodash/fp');

const BASE_URL = 'https://www.otpbank.hu/apps/composite/api/carsweepstakes/check';

commander
  .option('--tickets <ticketNumbers>', 'comma separated list', _.flow(_.split(','), _.map(_.trim), _.filter(_.negate(_.isEmpty))))
  .parse(process.argv);

const { tickets } = commander.opts();

tickets.forEach((ticketNb) => {
  if (ticketNb.length !== 9) throw new Error(`'${ticketNb}' should have length of 9`);
});

async function checkTicket(ticketNb) {
  const res = await got.get(`${BASE_URL}/${ticketNb}`, {
    responseType: 'json'
  });

  return res.body;
}

async function checkTickets() {
  const result = await Promise.all(tickets.map(checkTicket));
  console.table(result);
}

checkTickets()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
