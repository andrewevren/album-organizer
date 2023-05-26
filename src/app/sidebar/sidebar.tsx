import { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import albumArt from 'album-art';
import styles from './sidebar.module.scss';
import { useGetAlbumsQuery, useAddAlbumMutation } from 'src/api/firestoreApi';
import { AlbumSchema } from 'src/types/types';
import StackableAlbum from '../album/stackableAlbum';
import { FaTrash } from 'react-icons/fa';

/* eslint-disable-next-line */
export interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const [barOpen, setBarOpen] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [formData, setFormData] = useState({
    artist: '', album: ''
  })

  const [addAlbum] = useAddAlbumMutation();

  const { albums } = useGetAlbumsQuery(undefined, {
    selectFromResult: ({data}) => ({
      albums: data?.filter(album => album.shelf === 'new')
    })
  });

  let content: Array<object> = [];
  if (albums) {
    const albumsCopy = [...albums];
    const sortedAlbums = albumsCopy.sort((a,b) => {
      return a.order - b.order;
    });
    content = sortedAlbums.map((album:AlbumSchema, index: number) => <StackableAlbum key={album.id} id={album.id} imgUrl={album.imgUrl} artist={album.artist} title={album.title} index={index}/>)
  }

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBarOpen(!barOpen)
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //order needs fixing

    await albumArt(formData.artist, {album:formData.album, size:'medium'})
      .then((response:string) => {
        const newAlbum = {
          artist: formData.artist,
          imgUrl: response,
          order: albums.length,
          shelf: 'new',
          title: formData.album
        }
        addAlbum(newAlbum);
      }).catch((error: any) => {
        setErrorMessage('Sorry, album not found');
        setTimeout(() => setErrorMessage(null),5000);
      })

    setFormData({artist: '', album: ''})
  }

  return (
    <div className={styles['container']}>
      {barOpen ?
        <div className={styles['sidebar-content']} onClick={handleToggle}>
          <div>
            <h2>Add an Album</h2>
            <form onSubmit={handleSubmit}>
              <input className={styles['input']} type='text' placeholder='Artist' name='artist' value={formData.artist} onChange={handleChange}/>
              <input className={styles['input']} type='text' placeholder='Album' name='album' value={formData.album} onChange={handleChange}/>
              <button className={styles['search-submit']} type='submit'>Submit</button>
            </form>
            <Droppable droppableId='staging' type='album' isDropDisabled={true}>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={styles['new-album-box']}>
                  {content}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {errorMessage &&
              <p className={styles['error']}>{errorMessage}</p>
            }
          </div>
          <Droppable droppableId='delete' type='album'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles['delete-box']}>
                <FaTrash className={styles['trash']}/>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      : 
        <button className={styles['sidebar-toggle']} onClick={handleToggle}/>
      }
    </div>
  );
}

export default Sidebar;
