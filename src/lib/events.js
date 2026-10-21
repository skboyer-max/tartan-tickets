const dateAfterDays = (days, hour) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const events = [
  {
    id: 'fall-fest',
    title: 'Tartan Fall Fest',
    club: 'Scotty Events',
    startsAt: dateAfterDays(3, 17),
    location: 'The Cut, Carnegie Mellon University',
    priceCents: 1200,
    capacity: 120,
    ticketsSold: 83,
    description: 'An evening of music, food, and campus traditions.',
  },
  {
    id: 'film-night',
    title: 'Outdoor Film Night',
    club: 'Film Society',
    startsAt: dateAfterDays(7, 19),
    location: 'Baker Hall Patio',
    priceCents: 0,
    capacity: 60,
    ticketsSold: 60,
    description: 'Bring a blanket and enjoy a movie under the stars.',
  },
  {
    id: 'makers-market',
    title: 'Student Makers Market',
    club: 'Design Collective',
    startsAt: dateAfterDays(12, 12),
    location: 'Cohon University Center, Rangos Ballroom',
    priceCents: 500,
    capacity: 90,
    ticketsSold: 37,
    description: 'Shop art, prints, and small-batch goods made by students.',
  },
];

const waitlistEntries = [];
const orders = [];

function getUpcomingEvents(source = events, now = new Date()) {
  const timestamp = new Date(now).getTime();

  return source
    .filter((event) => new Date(event.startsAt).getTime() > timestamp)
    .map((event) => ({
      ...event,
      remainingSeats: Math.max(0, event.capacity - event.ticketsSold),
    }))
    .sort((first, second) => new Date(first.startsAt) - new Date(second.startsAt));
}

function getEventAction(event) {
  return event.remainingSeats === 0 ? 'Join waitlist' : 'Buy';
}

function joinWaitlist(eventId, name) {
  const event = events.find((entry) => entry.id === eventId);
  if (!event || new Date(event.startsAt) <= new Date()) {
    return { status: 404, body: { error: 'Event not found.' } };
  }
  if (event.capacity - event.ticketsSold > 0) {
    return { status: 409, body: { error: 'This event still has tickets available.' } };
  }

  const normalizedName = name.trim();
  const alreadyJoined = waitlistEntries.some(
    (entry) => entry.eventId === eventId && entry.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (alreadyJoined) {
    return { status: 409, body: { error: 'You are already on this event’s waitlist.' } };
  }

  waitlistEntries.push({ eventId, name: normalizedName, joinedAt: new Date().toISOString() });
  return { status: 201, body: { message: `You’re on the waitlist for ${event.title}.` } };
}

function simulatePurchase(eventId, name) {
  const event = events.find((entry) => entry.id === eventId);
  if (!event || new Date(event.startsAt) <= new Date()) {
    return { status: 404, body: { error: 'Event not found.' } };
  }
  if (event.capacity - event.ticketsSold <= 0) {
    return { status: 409, body: { error: 'This event just sold out. Join the waitlist instead.' } };
  }

  event.ticketsSold += 1;
  orders.push({ eventId, name: name.trim(), createdAt: new Date().toISOString() });
  return {
    status: 201,
    body: { message: `Simulated payment complete for ${event.title}. No charge was made.` },
  };
}

module.exports = { events, getUpcomingEvents, getEventAction, joinWaitlist, simulatePurchase };
