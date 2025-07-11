const Questions = ({ currElem, onToggle, isActive }) => {
  const { id, question, answer } = currElem;
  return (
    <li
      key={id}
      className="bg-zinc-400 border border-gray-300 rounded-lg shadow-md mb-4"
    >
      <div className="flex justify-between items-center px-4 py-3">
        <p className="text-gray-800 font-medium">{question}</p>
        <button
          onClick={onToggle}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isActive
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isActive ? "Close" : "See More"}
        </button>
      </div>
      {isActive && (
        <p className="px-4 py-2 text-gray-700 bg-zinc-400 border-t border-gray-200">
          {answer}
        </p>
      )}
    </li>
  );
};

export default Questions;
