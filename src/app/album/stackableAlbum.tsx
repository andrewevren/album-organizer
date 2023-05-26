import { Draggable } from 'react-beautiful-dnd';
import styles from './album.module.scss';

/* eslint-disable-next-line */
export interface AlbumProps {
  id: string;
  imgUrl: string;
  artist: string;
  title: string;
  index: number;
}

export function StackableAlbum(props: AlbumProps) {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {provided => (
        <img 
          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          src={props.imgUrl} alt={`${props.artist} - ${props.title}`} className={styles['stackable']}
        />
      )}
    </Draggable>
  );
}

export default StackableAlbum;
