import styles from './sidebar.module.scss';

/* eslint-disable-next-line */
export interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Sidebar!</h1>
    </div>
  );
}

export default Sidebar;
