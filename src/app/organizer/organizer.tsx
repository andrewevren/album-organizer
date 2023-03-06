import Collection from '../collection/collection';
import StyleSelector from '../style-selector/style-selector';
import styles from './organizer.module.scss';

/* eslint-disable-next-line */
export interface OrganizerProps {}

export function Organizer(props: OrganizerProps) {
  return (
    <div className={styles['container']}>
      <StyleSelector />
      <Collection />
    </div>
  );
}

export default Organizer;
