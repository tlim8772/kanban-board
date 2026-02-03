import { createContext, useState } from "react";

function genId() {
  return Math.floor(Math.random() * 2000000000);
}

export const KanbanContext = createContext();

export function useKanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [cols, setCols] = useState([]);

    function addTask(text, colId) {
      setTasks([...tasks,
        {
          id: genId(),
          colId,
          text,
        }
      ])
    }

    function addCol(text) {
      setCols([...cols,
        {
          id: genId(),
          text,
        }
      ])
    }

    return {
      tasks,
      addTask,

      cols,
      addCol,
    }
}