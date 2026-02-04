import { useContext, useState, useRef, useEffect } from 'react';
import styles from './KanbanBoard.module.css';
import { KanbanContext, useKanbanBoard } from './useKanbanBoard';
import DraggableLogo from '../assets/draggable.svg?react';

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

function PlaceholderCard({ task }) {
  const { taskDragLeave, taskDragDrop } = useContext(KanbanContext);
  return (
    <div 
      className={styles.placeholderCard}
      onDragLeave={taskDragLeave(task)}
      onDragOver={e => e.preventDefault()}
      onDrop={taskDragDrop(task)}
    >&nbsp;</div>
  )
}

function Col({ col, tasks }) {
  const { 
    addTask, 
    colTaskDragOver, 
    colDragStart, 
    colDragEnd, 
    colDragEnter 
  } = useContext(KanbanContext);
  
  const [input, setInput] = useState('');
  const dialogRef = useRef();
  const ref = useRef();

  return (
    <>
      <div 
        ref={ref}
        className={styles.column}
        onDragOver={colTaskDragOver(col, ref)}
      >
        <div className={styles.columnHeader}>
            <div
              draggable='true'
              onDragStart={colDragStart(col, ref)} 
              onDragEnd={colDragEnd(col)}
              onDragEnter={colDragEnter(col)}
            >
              <DraggableLogo style={{height: '32px', width: '32px', cursor: 'grab'}} />
            </div>
          <div>
            {col.text}&nbsp;
            <button onClick={() => dialogRef.current?.showModal()}>+</button>
          </div>
        </div>
        {tasks.map(t => {
          return (t.isPlaceholder) ? <PlaceholderCard key={t.id} task={t} /> : <Card key={t.id} task={t} />
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

function PlaceholderCol({ col }) {
  return (
    <div className={styles.column}></div>
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
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <h3>Kanban Board</h3>
          <button onClick={() => dialogRef.current?.showModal()}>+</button>
        </div>
        <div className={styles.board}>
          {cols.map(col => (!col.isPlaceholder) ?
            <Col 
              key={col.id} 
              col={col}
              tasks={tasks.filter(t => t.colId === col.id)} 
            /> 
            :
            <PlaceholderCol key={col.id} />
          )}
        </div>
        
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