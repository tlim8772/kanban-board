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

const cs = Array(2).fill(1).map((_, i) => { return {id: genId(), text: `col${i}`}});
const ts = Array(10).fill(1).map((_, i) => {
  return {
    id: genId(),
    colId: cs[Math.floor(Math.random() * 2)].id,
    text: `task${i}`,
    isPlaceholder: false,
  }
})

export const KanbanContext = createContext();

export function useKanbanBoard() {
    const [tasks, setTasks] = useState(ts);
    const [cols, setCols] = useState(cs);

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
        
        if (!taskDragged || task.isPlaceholder || task.id === taskDragged?.id) return;
        
        // when task is right below the dragged task don't do anything because it won't change anything.
        const myTasks = tasks.filter(t => t.colId === task.colId);
        const myIdx = myTasks.findIndex(t => t.id === task.id);
        const taskDraggedIdx = myTasks.findIndex(t => t.id === taskDragged?.id);
        if (taskDraggedIdx != -1 && taskDraggedIdx + 1 === myIdx) return;

        const idx = tasks.findIndex(t => t.id === task.id);
        setTasks([
          ...tasks.slice(0, idx),
          makePlaceholder(task.colId),
          ...tasks.slice(idx)
        ]);
      }
    }

    // only the placeholder calls this.
    // becase when I drag into a task, the placeholder take its place as the task is moved down.
    // if I call this on the real task, it will remove the placeholder as the task gets push down,
    // which I dont want.
    function taskDragLeave(task) {
      return (ev) => {
        if (!task.isPlaceholder) return;
        setTasks(tasks.filter(t => !t.isPlaceholder));
      }
    }

    function taskDragDrop(task) {
      return (ev) => {
        if (!task.isPlaceholder) return;
        const newTasks = tasks.filter(t => t.id !== taskDragged?.id);
        task.id = taskDragged?.id;
        task.text = taskDragged?.text;
        task.isPlaceholder = false;
        setTasks(newTasks);
      }
    }

    function colTaskDragOver(col, colDomElem) {
      return (ev) => {
        if (taskDragged) {
           const myTasks = tasks.filter(t => t.colId === col.id);
          if (myTasks.length > 0 && myTasks.at(-1).id === taskDragged?.id) return;
          if (myTasks.length > 0 && myTasks.at(-1).isPlaceholder) return;
          
          const { bottom } = colDomElem?.getBoundingClientRect();
          if (ev.clientY < bottom - 32) return;
          console.log('col drag enter');
          setTasks([...tasks, makePlaceholder(col.id)]);
        } else {
          
        }
       
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
      colTaskDragOver,
      taskDragDrop,
    }
}