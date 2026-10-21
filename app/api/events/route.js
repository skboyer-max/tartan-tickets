const { getUpcomingEvents } = require('../../../src/lib/events');

export async function GET() {
  return Response.json({ events: getUpcomingEvents() });
}
