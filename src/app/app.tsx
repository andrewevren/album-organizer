// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import Organizer from './organizer/organizer';
import Sidebar from './sidebar/sidebar';

export function App() {
  return (
    <div className={styles['container']}>
      <Organizer />
      <Sidebar />
    </div>
  );
}

export default App;
