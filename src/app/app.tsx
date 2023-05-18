import styles from './app.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Organizer from './organizer/organizer';
import Sidebar from './sidebar/sidebar';
import { useGetShelvesQuery, useReorderShelvesMutation } from 'src/api/firestoreApi';

export function App() {
  const [reorderShelves, result] = useReorderShelvesMutation();
  const {data: shelves} = useGetShelvesQuery();

  const {data: albums}

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'shelf') {
      if (shelves instanceof Array) {
        const newShelves = Array.from(shelves);
        const dragged = newShelves.splice(source.index, 1);
        newShelves.splice(destination.index, 0, ...dragged);
        const shelvesToReorder: Array<object> = [];
        const [start, end] = [source.index, destination.index].sort((a,b) => a-b)
        for(let i = start; i <= end; i++) {
          const newShelf = {id: newShelves[i].id, index: i};
          shelvesToReorder.push(newShelf);
        }
        reorderShelves(shelvesToReorder);
      }
    }

    
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
