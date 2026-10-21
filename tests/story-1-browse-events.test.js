const test = require('node:test');
const assert = require('node:assert/strict');
const { getUpcomingEvents, getEventAction } = require('../src/lib/events');

const now = new Date('2026-10-20T12:00:00.000Z');
const events = [
  {
    id: 'future',
    title: 'Future Event',
    startsAt: '2026-11-01T18:00:00.000Z',
    location: 'Rangos Ballroom',
    priceCents: 1250,
    capacity: 40,
    ticketsSold: 12,
  },
  {
    id: 'sold-out',
    title: 'Sold Out Event',
    startsAt: '2026-10-25T18:00:00.000Z',
    location: 'Cohon University Center',
    priceCents: 0,
    capacity: 10,
    ticketsSold: 10,
  },
  {
    id: 'past',
    title: 'Past Event',
    startsAt: '2026-10-19T18:00:00.000Z',
    location: 'Tepper Quad',
    priceCents: 500,
    capacity: 20,
    ticketsSold: 2,
  },
];

test('Story 1: lists upcoming events with date, location, price, and remaining seats', () => {
  const upcoming = getUpcomingEvents(events, now);

  assert.deepEqual(upcoming.map((event) => event.id), ['sold-out', 'future']);
  assert.equal(upcoming[1].startsAt, '2026-11-01T18:00:00.000Z');
  assert.equal(upcoming[1].location, 'Rangos Ballroom');
  assert.equal(upcoming[1].priceCents, 1250);
  assert.equal(upcoming[1].remainingSeats, 28);
});

test('Story 1: shows Join waitlist instead of Buy when an event is sold out', () => {
  const [soldOut] = getUpcomingEvents(events, now);

  assert.equal(soldOut.remainingSeats, 0);
  assert.equal(getEventAction(soldOut), 'Join waitlist');
  assert.equal(getEventAction(getUpcomingEvents(events, now)[1]), 'Buy');
});

test('Story 1: does not report negative seats remaining', () => {
  const [soldOut] = getUpcomingEvents(
    [{ ...events[1], ticketsSold: 12 }],
    now,
  );

  assert.equal(soldOut.remainingSeats, 0);
  assert.equal(getEventAction(soldOut), 'Join waitlist');
});
