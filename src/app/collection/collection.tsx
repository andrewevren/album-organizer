import styles from './collection.module.scss';

/* eslint-disable-next-line */
export interface CollectionProps {}

export function Collection(props: CollectionProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Collection!</h1>
    </div>
  );
}

export default Collection;
