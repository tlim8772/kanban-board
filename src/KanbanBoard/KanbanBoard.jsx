import { useContext, useState, useRef, useEffect } from 'react';
import styles from './KanbanBoard.module.css';
import { KanbanContext, useKanbanBoard } from './useKanbanBoard';

function Card({ task }) {
  const { taskDragged, taskDragStart, taskDragEnd, taskDragEnter, taskDragLeave } = useContext(KanbanContext);
  const isDragged = task == taskDragged;
  return (
    <div 
      className={`${styles.card} ${isDragged && styles.isDragged}`} 
      draggable='true'
      onDragStart={taskDragStart(task)}
      onDragEnd={taskDragEnd()}
      onDragOver={ev => ev.preventDefault()}
      onDragEnter={taskDragEnter(task)}
      onDragLeave={taskDragLeave(task)}
    >
      {task.text}
    </div>
  )
}

function PlaceHolderCard({ task }) {
  const { taskDragLeave } = useContext(KanbanContext);
  return (
    <div 
      className={styles.placeholderCard}
      onDragLeave={taskDragLeave(task)}
    >&nbsp;</div>
  )
}

function Col({ col, tasks }) {
  const { addTask, colTaskDragEnter } = useContext(KanbanContext);
  const [input, setInput] = useState('');
  const dialogRef = useRef();
  const ref = useRef();

  return (
    <>
      <div 
        ref={ref}
        className={styles.column}
        onDragEnter={colTaskDragEnter(col, ref.current)}
      >
        <div style={{marginBottom: '12px'}}>
          {col.text}&nbsp;
          <button onClick={() => dialogRef.current?.showModal()}>+</button>
        </div>
        {tasks.map(t => {
          return (t.isPlaceholder) ? <PlaceHolderCard key={t.id} task={t} /> : <Card key={t.id} task={t} />
        })}
      </div>
      <dialog ref={dialogRef} closedby='any'>
        <form
          className={styles.addForm}
          onSubmit={e =>{
            e.preventDefault();
            addTask(input, col.id);
            setInput('');
            dialogRef.current?.close();
          }}
        >
          <input value={input} placeholder='Task Description' onChange={e => setInput(e.target.value)}></input>
          <button>add</button>
        </form>
      </dialog>
    </>
  )
}

export function KanbanBoard() {
  const kanbanContext = useKanbanBoard();
  const { tasks, cols, addCol } = kanbanContext;

  const dialogRef = useRef();
  const [input, setInput] = useState('');

  return (
    <KanbanContext value={kanbanContext}>
      <div className={styles.main}>
        <h3>Kanban Board</h3>
        <div className={styles.board}>
          {cols.map(col => 
            <Col 
              key={col.id} 
              col={col}
              tasks={tasks.filter(t => t.colId === col.id)} 
            />
          )}
        </div>
        <button className={styles.addColBtn} onClick={() => dialogRef.current?.showModal()}>+</button>
      </div>
      <dialog ref={dialogRef} closedby='any'>
        <form
          className={styles.addForm}
          onSubmit={e => {
            e.preventDefault();
            addCol(input);
            setInput('');
            dialogRef.current?.close();
          }}
        >
          <input value={input} placeholder='Column Name' onChange={e => setInput(e.target.value)} />
          <button type='submit'>add</button>
        </form>
      </dialog>
    </KanbanContext>
  )
}