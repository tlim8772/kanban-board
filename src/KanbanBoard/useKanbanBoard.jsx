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
        taskDraggedRef.current = task;
      }
    }

    function taskDragEnd() {
      return () => {
        taskDraggedRef.current = null;
        //setTasks(tasks.filter(t => !t.isPlaceholder));
      }
    }

    function taskDragEnter(task) {
      return (ev) => {
        ev.preventDefault();
        
        if (task.isPlaceholder || task.id === taskDraggedRef.current?.id) return;
        const idx = tasks.findIndex(t => t.id === task.id);
        /*setTasks([
          ...tasks.slice(0, idx),
          makePlaceholder(task.colId),
          ...tasks.slice(idx)
        ]);*/
        console.log('drag enter', idx);
      }
    }

    // cannot affect task being dragged and placeholder
    function taskDragLeave(task) {
      return (ev) => {
        if (task.isPlaceholder || task.id === taskDraggedRef.current?.id) return;
        //setTasks(tasks.filter(t => !t.isPlaceholder));
        console.log('drag leave');
      }
    }
 
    return {
      tasks,
      addTask,

      cols,
      addCol,

      taskDragStart,
      taskDragEnd,
      taskDragEnter,
      taskDragLeave,
    }
}