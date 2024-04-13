import React, { useState, useEffect } from 'react';
import dbConnect from '../../utils/dbConnect';
import Event from '../../models/Event';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [entryFee, setEntryFee] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      await dbConnect();
      const eventData = await Event.find({});
      setEvents(eventData);
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dbConnect();
      const newEvent = new Event({
        name,
        description,
        startDate,
        endDate,
        entryFee,
      });
      await newEvent.save();
      // Reset form fields
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setEntryFee(0);
      // Refresh the events list
      const updatedEvents = await Event.find({});
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div>
      <h1>Events Management</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <label>
          Entry Fee:
          <input
            type="number"
            step="0.01"
            value={entryFee}
            onChange={(e) => setEntryFee(parseFloat(e.target.value))}
            required
          />
        </label>
        <button type="submit">Create Event</button>
      </form>
      <h2>Existing Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(event.endDate).toLocaleDateString()}</p>
            <p>Entry Fee: {event.entryFee}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsManagement;
