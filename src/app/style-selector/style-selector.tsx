import styles from './style-selector.module.scss';

/* eslint-disable-next-line */
export interface StyleSelectorProps {}

export function StyleSelector(props: StyleSelectorProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to StyleSelector!</h1>
    </div>
  );
}

export default StyleSelector;
