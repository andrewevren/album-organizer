import styles from './shelf.module.scss';
import { useState } from 'react';
import { useGetAlbumsQuery, useChangeShelfNameMutation, useDeleteShelfMutation } from 'src/api/firestoreApi';
import { FaTrash } from 'react-icons/fa';
import { AlbumSchema } from 'src/types/types';
import Album from '../album/album';

/* eslint-disable-next-line */
export interface ShelfProps {
  id: string;
  name: string;
}

export function Shelf({id, name}: ShelfProps) {
  const [currentName, setCurrentName] = useState(name);
  const [changeShelfName, changeResult] = useChangeShelfNameMutation();
  const [deleteShelf, deleteResult] = useDeleteShelfMutation();

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
  } else if (albums instanceof Array && albums.length === 0) {
    content = <p>Drag albums here!</p>
  }

  const onInputBlur = async () => {
    try {
      await changeShelfName({id, currentName})
    } catch (err:any) {
      //TODO: fix error catching, should revert change
      console.error('Name change error!')
    }
  }

  const onDeleteClick = async () => {
    if (window.confirm("Delete this shelf? Action cannot be undone.")) {
      try { 
        await deleteShelf({id})
      } catch (err:any) {
        //TODO: error should revert change
        console.error('Error occured when deleting shelf!')
      }
    } 
  }

  return (
    <div className={styles['container']}>
      <FaTrash className={styles['trash']} onClick={onDeleteClick}/>
      <input className={styles['shelf-name']} value={currentName} onChange={(e) => setCurrentName(e.target.value)} onBlur={onInputBlur} placeholder='Name Your Shelf!'/>
      <div className={styles['album-container']}>
        {content}
      </div>
    </div>
  );
}

export default Shelf;
