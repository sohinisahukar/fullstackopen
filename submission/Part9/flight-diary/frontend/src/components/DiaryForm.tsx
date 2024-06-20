import { useState, useEffect } from 'react';
import axios from 'axios';
import diaryService from '../services/diaryService';
import { NewDiaryEntry, Weather, Visibility, DiaryEntry } from '../types';

const DiaryForm = ({ onAdd }: { onAdd: (entry: DiaryEntry) => void }) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const addDiary = async (event: React.FormEvent) => {
    event.preventDefault();
    const newDiaryEntry: NewDiaryEntry = { date, weather, visibility, comment };

    try {
        const addedDiary = await diaryService.create(newDiaryEntry);
        onAdd(addedDiary);
      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Great);
      setComment('');
      setError('');
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setError(e.response.data);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      // Clear the timeout if the component is unmounted or if error changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <h2>Add New Entry</h2>
      <form onSubmit={addDiary}>
        <div>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Weather</label>
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type="radio"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>
        <div>
          <label>Visibility</label>
          {Object.values(Visibility).map((v) => (
            <label key={v}>
              <input
                type="radio"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>
        <div>
          <label>
            Comment
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DiaryForm;
