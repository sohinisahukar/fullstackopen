import { DiaryEntry } from '../types';

const DiaryList = ({ diaries }: { diaries: DiaryEntry[] }) => {
  return (
    <div>
      <h2>Diary Entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id} className="diary-entry">
          <p><strong>Date:</strong> {diary.date}</p>
          <p><strong>Weather:</strong> {diary.weather}</p>
          <p><strong>Visibility:</strong> {diary.visibility}</p>
          <p><strong>Comment:</strong> {diary.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryList;
