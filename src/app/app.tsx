import styles from './app.module.scss';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInAnonymously } from "firebase/auth";
import Home from './home/home';

const auth = getAuth();

export function App() {


  //const [user, loading, error] = useAuthState(auth);

  const user = {uid: 'xVV3Jdw2FgcO0TQENiiSYAT54U23'}

  if (!user) {
    signInAnonymously(auth)
  }


  return (
    <div>
      {user ? 
      <Home user={user.uid} />
      :
      <p>Loading</p>
      }
    </div>
  );
}

export default App;
