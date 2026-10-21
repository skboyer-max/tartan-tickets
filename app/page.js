'use client';

import { useEffect, useState } from 'react';

function formatEventDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatPrice(cents) {
  return cents === 0 ? 'Free' : `$${(cents / 100).toFixed(2)}`;
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState({ kind: 'loading', message: '' });
  const [busyEvent, setBusyEvent] = useState(null);
  const [message, setMessage] = useState('');

  async function loadEvents() {
    setStatus({ kind: 'loading', message: '' });
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Could not load events. Please try again.');
      const data = await response.json();
      setEvents(data.events);
      setStatus({ kind: data.events.length ? 'success' : 'empty', message: '' });
    } catch (error) {
      setStatus({ kind: 'error', message: error.message });
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function submitAction(event, action) {
    if (!name.trim()) {
      setMessage('Type your name above before continuing.');
      return;
    }

    setBusyEvent(event.id);
    setMessage('');
    try {
      const response = await fetch(action === 'waitlist' ? '/api/waitlist' : '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, name }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
      setMessage(result.message);
      await loadEvents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusyEvent(null);
    }
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Tartan Tickets home">
          <span className="brand-mark" aria-hidden="true">TT</span>
          <span>Tartan Tickets</span>
        </a>
        <span className="header-note">Campus events, all in one place</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">YOUR CAMPUS, YOUR PLANS</p>
        <h1 id="page-title">Find your next<br /><span>favorite thing.</span></h1>
        <p className="hero-copy">Discover what’s happening around campus. Good nights start here.</p>
        <label className="name-field">
          <span>Your name</span>
          <input
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type your name"
          />
        </label>
      </section>

      <section className="events-section" aria-labelledby="events-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MAKE IT A NIGHT</p>
            <h2 id="events-title">Upcoming events</h2>
          </div>
          <span className="live-label"><span aria-hidden="true" /> Live availability</span>
        </div>

        {status.kind === 'loading' && <p className="state-message" role="status">Finding the good stuff…</p>}
        {status.kind === 'error' && (
          <div className="state-message error-state" role="alert">
            <p>{status.message}</p>
            <button className="text-button" onClick={loadEvents}>Try again</button>
          </div>
        )}
        {status.kind === 'empty' && <p className="state-message">No upcoming events yet.</p>}
        {status.kind === 'success' && (
          <div className="event-grid">
            {events.map((event, index) => {
              const soldOut = event.remainingSeats === 0;
              return (
                <article className={`event-card${soldOut ? ' sold-out-card' : ''}`} key={event.id}>
                  <div className={`event-art art-${index % 3}`} aria-hidden="true">
                    <span className="art-label">{event.club}</span>
                    <span className="art-monogram">{event.title.split(' ').map((word) => word[0]).join('').slice(0, 3)}</span>
                    <span className="art-spark">✳</span>
                  </div>
                  <div className="event-content">
                    <div className="event-topline">
                      <span className="event-club">{event.club}</span>
                      <span className={`availability${soldOut ? ' sold-out' : ''}`}>
                        {soldOut ? 'Sold out' : `${event.remainingSeats} seats left`}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <dl className="event-details">
                      <div><dt>Date</dt><dd>{formatEventDate(event.startsAt)}</dd></div>
                      <div><dt>Location</dt><dd>{event.location}</dd></div>
                      <div><dt>Price</dt><dd>{formatPrice(event.priceCents)}</dd></div>
                    </dl>
                    <button
                      className={`action-button${soldOut ? ' waitlist-button' : ''}`}
                      disabled={busyEvent === event.id}
                      onClick={() => submitAction(event, soldOut ? 'waitlist' : 'purchase')}
                    >
                      {busyEvent === event.id ? 'Please wait…' : soldOut ? 'Join waitlist' : 'Simulated payment'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {message && <p className="feedback-message" role="status">{message}</p>}
      </section>

      <footer className="site-footer">
        <span>Made for the moments between classes.</span>
        <span>✳ Pittsburgh, PA</span>
      </footer>
    </main>
  );
}
