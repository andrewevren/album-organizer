// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import Organizer from './organizer/organizer';
import Sidebar from './sidebar/sidebar';

export function App() {
  return (
    <>
      <Organizer />
      <Sidebar />
    </>
  );
}

export default App;
