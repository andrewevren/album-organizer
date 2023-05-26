import styles from './app.module.scss';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Organizer from './organizer/organizer';
import Sidebar from './sidebar/sidebar';
import { useGetShelvesQuery, useGetAlbumsQuery, useReorderShelvesMutation, useReorderAlbumsMutation, useDeleteAlbumMutation } from 'src/api/firestoreApi';

export function App() {
  const [reorderShelves] = useReorderShelvesMutation();
  const {data: shelves} = useGetShelvesQuery();

  const [reorderAlbums] = useReorderAlbumsMutation();
  const [deleteAlbum] = useDeleteAlbumMutation();
  const {data: albums} = useGetAlbumsQuery();

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'shelf' && shelves instanceof Array) {
      const shelvesCopy = Array.from(shelves);
      const newShelves = shelvesCopy.sort((a,b) => {
        return a.order - b.order;
      });
      const dragged = newShelves.splice(source.index, 1);
      newShelves.splice(destination.index, 0, ...dragged);
      const shelvesToReorder: Array<object> = [];
      const [start, end] = [source.index, destination.index].sort((a,b) => a-b)
      for (let i = start; i <= end; i++) {
        const newShelf = {id: newShelves[i].id, index: i};
        shelvesToReorder.push(newShelf);
      }
      reorderShelves(shelvesToReorder);
      return;
    }

    const home = shelves.find(i => i.id === source.droppableId);
    const foreign = shelves.find(i => i.id === destination.droppableId);

    if (destination.droppableId === 'delete') {
      if  (source.droppableId === 'staging') {
        const sourceAlbums = albums.filter(album => album.shelf === 'new').sort((a,b) => a.order - b.order);
        const dragged = sourceAlbums.splice(source.index, 1);
        const id = dragged[0].id;
        deleteAlbum({id});
        return;
      }

      const sourceAlbums = albums.filter(album => album.shelf === home.id).sort((a,b) => a.order - b.order);
      const dragged = sourceAlbums.splice(source.index, 1);
      const sourceAlbumsToReorder: Array<object> = [];
      for (let i = source.index; i <= sourceAlbums.length - 1; i++) {
        const newAlbum = {id: sourceAlbums[i].id, index: i, shelf: home.id};
        sourceAlbumsToReorder.push(newAlbum);
      }
      reorderAlbums(sourceAlbumsToReorder);
      const id = dragged[0].id;
      deleteAlbum({id});
      return;
    }

    if (source.droppableId === 'staging') {
      const sourceAlbums = albums.filter(album => album.shelf === 'new').sort((a,b) => a.order - b.order);
      const dragged = sourceAlbums.splice(source.index, 1);
      const destinationAlbums = albums.filter(album => album.shelf === foreign.id).sort((a,b) => a.order - b.order);
      destinationAlbums.splice(destination.index, 0, ...dragged);
      const albumsToReorder: Array<object> = [];
      for (let i = destination.index; i <= destinationAlbums.length - 1; i++) {
        const newAlbum = {id: destinationAlbums[i].id, index: i, shelf: foreign.id};
        albumsToReorder.push(newAlbum);
      }
      reorderAlbums(albumsToReorder);
      return;
    }

    if (home === foreign) {
      const albumsCopy = albums.filter(album => album.shelf === home.id);
      const sortedAlbums = albumsCopy.sort((a,b) => a.order - b.order);
      const dragged = sortedAlbums.splice(source.index, 1);
      sortedAlbums.splice(destination.index, 0, ...dragged);
      const albumsToReorder: Array<object> = [];
      const [start, end] = [source.index, destination.index].sort((a,b) => a-b);
      for (let i = start; i <= end; i++) {
        const newAlbum = {id: sortedAlbums[i].id, index: i, shelf: home.id};
        albumsToReorder.push(newAlbum);
      }
      reorderAlbums(albumsToReorder);
      return;
    }

    const sourceAlbums = albums.filter(album => album.shelf === home.id).sort((a,b) => a.order - b.order);
    const dragged = sourceAlbums.splice(source.index, 1);
    const sourceAlbumsToReorder: Array<object> = [];
    for (let i = source.index; i <= sourceAlbums.length - 1; i++) {
      const newAlbum = {id: sourceAlbums[i].id, index: i, shelf: home.id};
      sourceAlbumsToReorder.push(newAlbum);
    }
    reorderAlbums(sourceAlbumsToReorder);

    const destinationAlbums = albums.filter(album => album.shelf === foreign.id).sort((a,b) => a.order - b.order);
    destinationAlbums.splice(destination.index, 0, ...dragged);
    const destinationAlbumsToReorder: Array<object> = [];
    for (let i = destination.index; i <= destinationAlbums.length - 1; i++) {
      const newAlbum = {id: destinationAlbums[i].id, index: i, shelf: foreign.id};
      destinationAlbumsToReorder.push(newAlbum);
    }
    reorderAlbums(destinationAlbumsToReorder);

    //If either of those queries fails they both must fail

  }

  return (
    <DragDropContext
    onDragEnd={onDragEnd}>
      <div className={styles['container']}>
        <Organizer />
        <Sidebar />
      </div>
    </DragDropContext>
  );
}

export default App;
