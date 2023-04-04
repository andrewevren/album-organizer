import { useGetShelvesQuery } from 'src/api/firestoreApi';
import { ShelfSchema } from 'src/types/types';
import Shelf from '../shelf/shelf';
import StyleSelector from '../style-selector/style-selector';
import styles from './organizer.module.scss';

/* eslint-disable-next-line */
export interface OrganizerProps {}

export function Organizer(props: OrganizerProps) {
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
    content = shelves.map((shelf: ShelfSchema) => <Shelf key={shelf.id} name={shelf.name} />)
  } else if (isError) {
    content = <p>Something went wrong :/</p>
  }

  return (
    <div className={styles['container']}>
      <StyleSelector />
      <div className={styles['shelf-container']}>
        {content}
      </div>
      <button className={styles['add-section']}>+</button>
    </div>
  );
}

export default Organizer;
