import { createContext, useState, useRef } from "react";

function genId() {
  return Math.floor(Math.random() * 2000000000);
}

function makePlaceholder(colId) {
  return {
    id: genId(),
    colId,
    text: '',
    isPlaceholder: true,
  }
}

export const KanbanContext = createContext();

export function useKanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [cols, setCols] = useState([]);

    const taskDraggedRef = useRef();
    const [taskDragged, setTaskDragged] = useState(null);

    function addTask(text, colId) {
      setTasks([...tasks,
        {
          id: genId(),
          colId,
          text,
          isPlaceholder: false,
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

    function taskDragStart(task) {
      return (ev) => {
        setTaskDragged(task);
      }
    }

    function taskDragEnd() {
      return () => {
        setTaskDragged(null);
        setTasks(tasks.filter(t => !t.isPlaceholder));
      }
    }

    function taskDragEnter(task) {
      return (ev) => {
        ev.preventDefault();
        
        if (task.isPlaceholder || task.id === taskDragged?.id) return;
        const realTasks = tasks.filter(t => !t.isPlaceholder);
        const idx = realTasks.findIndex(t => t.id === task.id);
        setTasks([
          ...realTasks.slice(0, idx),
          makePlaceholder(task.colId),
          ...realTasks.slice(idx)
        ]);
      }
    }

    // only the placeholder calls this.
    // becase when I drag into a task, the placeholder take its place as the task is moved down.
    // if I call this on the real task, it will remove the placeholder as the task gets push down,
    // which I dont want.
    function taskDragLeave(task) {
      return (ev) => {
        if (!task.isPlaceholder || task.id === taskDragged?.id) return;
        setTasks(tasks.filter(t => !t.isPlaceholder));
      }
    }

    return {
      tasks,
      addTask,

      cols,
      addCol,

      taskDragged,
      taskDragStart,
      taskDragEnd,
      taskDragEnter,
      taskDragLeave,
    }
}