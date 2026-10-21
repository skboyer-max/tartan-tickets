const { joinWaitlist } = require('../../../src/lib/events');

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Please provide a valid request.' }, { status: 400 });
  }

  if (typeof body.eventId !== 'string' || typeof body.name !== 'string' || !body.name.trim()) {
    return Response.json({ error: 'Event and name are required.' }, { status: 400 });
  }

  const result = joinWaitlist(body.eventId, body.name);
  return Response.json(result.body, { status: result.status });
}
