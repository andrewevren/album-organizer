import styles from './collection.module.scss';

/* eslint-disable-next-line */
export interface CollectionProps {}

export function Collection(props: CollectionProps) {
  return (
    <div className={styles['container']}>
      <input className={styles['collection-name']} placeholder='My New Collection'/>
      <div className={styles['album-container']}>
        <p>
          Drag albums here!
        </p>
      </div>
    </div>
  );
}

export default Collection;
