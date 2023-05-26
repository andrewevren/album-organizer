import styles from './shelf.module.scss';
import { useState } from 'react';
import { useGetAlbumsQuery, useChangeShelfNameMutation } from 'src/api/firestoreApi';
import { FaTrash } from 'react-icons/fa';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { AlbumSchema } from 'src/types/types';
import Album from '../album/album';

export interface ShelfProps {
  id: string;
  name: string;
  index: number;
  deleteHandler: (id: string, index: number)=>void;
}

export function Shelf({id, name, index, deleteHandler}: ShelfProps) {
  const [currentName, setCurrentName] = useState(name);
  const [changeShelfName] = useChangeShelfNameMutation();

  const {
    data: albums,
    isLoading,
    isSuccess,
    isError
  } = useGetAlbumsQuery(undefined, {
    selectFromResult: ({data, isLoading, isSuccess, isError}) => ({
      data: data?.filter(album => album.shelf === id),
      isLoading,
      isSuccess,
      isError
    })
  });

  let content: any;
  
  //TODO: why isn't text rendering
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess && albums instanceof Array ) {
    const albumsCopy = [...albums];
    const sortedAlbums = albumsCopy.sort((a,b) => {
      return a.order - b.order;
    });
    content = sortedAlbums.map((album:AlbumSchema, index: number) => <Album key={album.id} id={album.id} imgUrl={album.imgUrl} artist={album.artist} title={album.title} index={index}/>)
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

  const onDeleteClick = () => {
    deleteHandler(id, index);
  }


  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={styles['container']}>
          <FaTrash className={styles['trash']} onClick={onDeleteClick}/>
          <input className={styles['shelf-name']} value={currentName} onChange={(e) => setCurrentName(e.target.value)} onBlur={onInputBlur} placeholder='Name Your Shelf!'/>
          <Droppable droppableId={id} direction='horizontal' type='album'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles['album-container']}>
                {content}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Shelf;
