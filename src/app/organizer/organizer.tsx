import { useAddShelfMutation, useGetShelvesQuery, useDeleteShelfMutation, useReorderShelvesMutation } from 'src/api/firestoreApi';
import { ShelfSchema } from 'src/types/types';
import { Droppable } from 'react-beautiful-dnd';
import Shelf from '../shelf/shelf';
import StyleSelector from '../style-selector/style-selector';
import styles from './organizer.module.scss';

/* eslint-disable-next-line */
export interface OrganizerProps {}

export function Organizer(props: OrganizerProps) {
  const [addShelf] = useAddShelfMutation();
  const [deleteShelf] = useDeleteShelfMutation();
  const [reorderShelves] = useReorderShelvesMutation();

  const {
    data: shelves,
    isLoading,
    isSuccess,
    isError
  } = useGetShelvesQuery();

  let content: any;

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess && shelves instanceof Array) {
    const shelvesCopy = [...shelves]
    const sortedShelves = shelvesCopy.sort((a,b) => {
      return a.order - b.order;
    });
  
    const deleteHandler = async (id: string, index: number) => {
      if (window.confirm("Delete shelf? This action cannot be undone.")) {
        try { 
          const sortedShelvesCopy = [...sortedShelves];
          sortedShelvesCopy.splice(index, 1);
          const shelvesToReorder: Array<object> = [];
          for (let i = index; i <= sortedShelvesCopy.length - 1; i++) {
            const newShelf = {id: sortedShelvesCopy[i].id, index: i};
            shelvesToReorder.push(newShelf);
          } 
          await deleteShelf({id});
          await reorderShelves(shelvesToReorder);
        } catch (err:any) {
          console.error('Error occured when deleting shelf!')
        }
      } 
    }

    content = sortedShelves.map((shelf: ShelfSchema, index: number) => <Shelf key={shelf.id} id={shelf.id} name={shelf.name} index={index} deleteHandler={deleteHandler}/>)
  } else if (isError) {
    content = <p>Something went wrong :/</p>
  }

  const plusClick = async () => {
    if (shelves instanceof Array) {
      const newOrder = shelves.length;
      await addShelf({newOrder});
    }
  }

  return (
    <div className={styles['container']}>
      <StyleSelector />
      <Droppable droppableId='organizer' type='shelf'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={styles['shelf-container']}>
            {content}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button className={styles['add-section']} onClick={plusClick}>+</button>
    </div>
  );
}

export default Organizer;
