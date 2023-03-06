import styles from './style-selector.module.scss';

/* eslint-disable-next-line */
export interface StyleSelectorProps {}

export function StyleSelector(props: StyleSelectorProps) {
  return (
    <div className={styles['container']}>
      <button>Style</button>
    </div>
  );
}

export default StyleSelector;
