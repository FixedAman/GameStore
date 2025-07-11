import { useEffect, useState } from "react";
import faq from "../api/faq.json";
import Questions from "./layout/Accordion";

const Accordion = () => {
  const [data, setData] = useState([]);
  const [activeId, setActiveId] = useState(false);

  useEffect(() => {
    setData(faq);
  }, []);

  const handleClick = (id) => {
    setActiveId((prevId) => (prevId === id ? false : id));
  };

  return (
    <div className="max-w-4xl pl-12 mx-auto p-6 bg-zinc-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-white-600 mb-4 ">
        FAQ Questions
      </h1>
      <ul className="space-y-4">
        {data.map((currElem) => (
          <Questions
            key={currElem.id}
            currElem={currElem}
            isActive={activeId === currElem.id}
            onToggle={() => handleClick(currElem.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Accordion;
