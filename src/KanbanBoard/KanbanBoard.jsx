import { useContext, useState, useRef } from 'react';
import styles from './KanbanBoard.module.css';
import { KanbanContext, useKanbanBoard } from './useKanbanBoard';

function Card({ task }) {
  const { taskDragStart, taskDragEnd, taskDragEnter, taskDragLeave } = useContext(KanbanContext);
  
  return (
    <div 
      className={styles.card} 
      draggable='true'
      onDragStart={taskDragStart(task)}
      onDragEnd={taskDragEnd()}
      onDragEnter={taskDragEnter(task)}
      onDragLeave={taskDragLeave(task)}
    >
      {task.text}
    </div>
  )
}

function PlaceHolderCard() {
  return (
    <div className={styles.placeholderCard}>+</div>
  )
}

function Col({ col, tasks }) {
  const { addTask } = useContext(KanbanContext);
  const [input, setInput] = useState('');
  const dialogRef = useRef();

  return (
    <>
      <div className={styles.column}>
        <div style={{marginBottom: '12px'}}>
          {col.text}&nbsp;
          <button onClick={() => dialogRef.current?.showModal()}>+</button>
        </div>
        {tasks.map(t => {
          return (t.isPlaceholder) ? <PlaceHolderCard key={t.id} /> : <Card key={t.id} task={t} />
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