import { useAddShelfMutation, useGetShelvesQuery } from 'src/api/firestoreApi';
import { ShelfSchema } from 'src/types/types';
import Shelf from '../shelf/shelf';
import StyleSelector from '../style-selector/style-selector';
import styles from './organizer.module.scss';

/* eslint-disable-next-line */
export interface OrganizerProps {}

export function Organizer(props: OrganizerProps) {
  const [addShelf, result] = useAddShelfMutation();

  const {
    data: shelves,
    isLoading,
    isSuccess,
    isError
  } = useGetShelvesQuery();

  let content;

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess && shelves instanceof Array) {
    content = shelves.map((shelf: ShelfSchema) => <Shelf key={shelf.id} id={shelf.id} name={shelf.name} />)
  } else if (isError) {
    content = <p>Something went wrong :/</p>
  }

  const plusClick = async () => {
    let newOrder = 1;
    if (shelves instanceof Array) {
      newOrder = shelves[shelves.length-1].order + 1;
    }
    await addShelf({newOrder});
  }

  return (
    <div className={styles['container']}>
      <StyleSelector />
      <div className={styles['shelf-container']}>
        {content}
      </div>
      <button className={styles['add-section']} onClick={plusClick}>+</button>
    </div>
  );
}

export default Organizer;
