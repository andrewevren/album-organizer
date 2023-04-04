import Shelf from '../shelf/shelf';
import StyleSelector from '../style-selector/style-selector';
import styles from './organizer.module.scss';

/* eslint-disable-next-line */
export interface OrganizerProps {}

export function Organizer(props: OrganizerProps) {
  return (
    <div className={styles['container']}>
      <StyleSelector />
      <div className={styles['shelf-container']}>
        <Shelf />
      </div>
      <button className={styles['add-section']}>+</button>
    </div>
  );
}

export default Organizer;
