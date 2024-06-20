import { CoursePart } from "./types/courseParts.ts";
import Part from "./Part";

interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};

export default Content;
