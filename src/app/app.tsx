import styles from './app.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import Organizer from './organizer/organizer';
import Sidebar from './sidebar/sidebar';

export function App() {
  const onDragEnd = (result: DropResult) => {
    //TODO: implement
    console.log(result)
  }

  return (
    <DragDropContext
    onDragEnd={onDragEnd}>
      <div className={styles['container']}>
        <Organizer />
        <Sidebar />
      </div>
    </DragDropContext>
  );
}

export default App;
