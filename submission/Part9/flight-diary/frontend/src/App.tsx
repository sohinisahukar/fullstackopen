import { useState, useEffect } from 'react';
import Header from './components/Header';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import { DiaryEntry } from './types';
import diaryService from './services/diaryService'
import './App.css'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const data = await diaryService.getAll();
      setDiaries(data);
    };

    fetchDiaries();
  }, []);

  const handleAddDiary = (newDiary: DiaryEntry) => {
    setDiaries([...diaries, newDiary]);
  };

  return (
    <div>
      <Header />
      <DiaryForm onAdd={handleAddDiary} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
