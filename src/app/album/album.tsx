import styles from './album.module.scss';

/* eslint-disable-next-line */
export interface AlbumProps {
  imgUrl: string;
  artist: string;
  title: string;
}

export function Album(props: AlbumProps) {
  return (
    <img src={props.imgUrl} alt={`${props.artist} - ${props.title}`} className={styles['image']}/>
  );
}

export default Album;
