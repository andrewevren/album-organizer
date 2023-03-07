import { useState } from 'react';
import albumArt from 'album-art';
import styles from './sidebar.module.scss';

/* eslint-disable-next-line */
export interface SidebarProps {}

export function Sidebar(props: SidebarProps) {
  const [barOpen, setBarOpen] = useState(true)
  const [newAlbum, setNewAlbum] = useState('')
  const [formData, setFormData] = useState({
    artist: '', album: ''
  })

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setBarOpen(!barOpen)
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    setFormData({...formData, [name]: value})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await albumArt(formData.artist, {album:formData.album, size:'medium'})
      .then((response:string) => setNewAlbum(response))

    setFormData({artist: '', album: ''})
  }

  return (
    <div className={styles['container']}>
      <button className={styles['sidebar-toggle']} onClick={handleToggle}/>
      {barOpen &&
        <div className={styles['sidebar-content']}>
          <div>
            <h2>Add an Album</h2>
            <form onSubmit={handleSubmit}>
              <input className={styles['input']} type='text' placeholder='Artist' name='artist' value={formData.artist} onChange={handleChange}/>
              <input className={styles['input']} type='text' placeholder='Album' name='album' value={formData.album} onChange={handleChange}/>
              <button className={styles['search-submit']} type='submit'>Submit</button>
            </form>
            <div className={styles['new-album-box']}>
              {newAlbum !== '' &&
                <img src={newAlbum} alt='Album art' className={styles['new-album-art']} />
              }
            </div>
          </div>
          <div>
            <input className={styles['input']} type='text' placeholder='Name'/>
            <button className={styles['save-submit']}>Save</button>
          </div>
        </div>
      }
    </div>
  );
}

export default Sidebar;
