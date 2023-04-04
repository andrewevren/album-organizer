import styles from './shelf.module.scss';
import { useGetAlbumsQuery } from 'src/api/firestoreApi';
import { AlbumSchema } from 'src/types/types';
import Album from '../album/album';

/* eslint-disable-next-line */
export interface ShelfProps {
  name: string;
}

export function Shelf(props: ShelfProps) {
  const {
    data: albums,
    isLoading,
    isSuccess,
    isError
  } = useGetAlbumsQuery();

  let content;

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess && albums instanceof Array ) {
    content = albums.map((album:AlbumSchema) => <Album key={album.id} imgUrl={album.imgUrl} artist={album.artist} title={album.title}/>)
  } else if (isError) {
    content = <p>Something went wrong</p>
  } else if (albums instanceof Array && albums.length == 0) {
    content = <p>Drag albums here!</p>
  }

  return (
    <div className={styles['container']}>
      <input className={styles['shelf-name']} placeholder='My New Shelf'/>
      <div className={styles['album-container']}>
        {content}
      </div>
    </div>
  );
}

export default Shelf;
