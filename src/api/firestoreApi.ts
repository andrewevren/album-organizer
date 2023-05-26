import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';
import { collection, query, where, doc, getDocs, updateDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";
import { db } from '../utils/firebase';
import { AlbumSchema, ShelfSchema } from 'src/types/types';

//TODO: replace generic object type with album and shelf interfaces
export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Album', 'Shelf'],
    endpoints: builder => ({
        getAlbums: builder.query<object, void> ({
            async queryFn() {
                try {
                    const ref = collection(db, 'albums');
                    const querySnapshot = await getDocs(ref);
                    const albums: Array<AlbumSchema> = [];
                    querySnapshot?.forEach((doc) => {
                        albums.push({id: doc.id, ...doc.data()} as AlbumSchema)
                    });
                    const sortedAlbums = albums.sort((a,b) => {
                        return a.order - b.order;
                    });
                    return {data: sortedAlbums};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            providesTags: ['Album']
        }),
        addAlbum: builder.mutation({
            async queryFn(newAlbum) {
                try {
                    const ref = collection(db, 'albums');
                    await addDoc(ref, newAlbum);
                    return {data: null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            invalidatesTags: ['Album']
        }),
        deleteAlbum: builder.mutation({
            async queryFn({id}) {
                try {
                    const ref = doc(db, 'albums', id);
                    await deleteDoc(ref);
                    return {data:null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            async onQueryStarted({id}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getAlbums', undefined, (draft) => {
                        const albumToDelete = draft.find(item => item.id === id);
                        albumToDelete.shelf = 'deleted'
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        reorderAlbums: builder.mutation({
            async queryFn(albumsToReorder) {
                try {
                    const batch = writeBatch(db);
                    albumsToReorder.forEach((album: {id: string, index: number, shelf: string}) => {
                        const ref = doc(db, 'albums', album.id);
                        batch.update(ref, {order: album.index, shelf: album.shelf});
                    });
                    await batch.commit();
                    return {data: null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            async onQueryStarted(albumsToReorder, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getAlbums', undefined, (draft) => {
                        albumsToReorder.forEach((album: {id: string, index: number, shelf: string}) => {
                            const albumToUpdate = draft.find(item => item.id === album.id);
                            if (albumToUpdate) {
                                albumToUpdate.order = album.index;
                                albumToUpdate.shelf = album.shelf;
                            }
                        })
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        getShelves: builder.query<object, void> ({
            async queryFn() {
                try {
                    const ref = collection(db, 'shelves');
                    const querySnapshot = await getDocs(ref);
                    const shelves: Array<ShelfSchema> = [];
                    querySnapshot?.forEach((doc) => {
                        shelves.push({id: doc.id, ...doc.data()} as ShelfSchema)
                    });
                    return {data: shelves}
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            providesTags: ['Shelf']
        }),
        addShelf: builder.mutation({
            async queryFn({newOrder}) {
                try {
                    const ref = collection(db, 'shelves');
                    await addDoc(ref, {
                        name: "My New Shelf",
                        order: newOrder
                    });
                    return {data: null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            invalidatesTags: ['Shelf']
        }),
        deleteShelf: builder.mutation({
            async queryFn({id}) {
                try {
                    const shelfRef = doc(db, 'shelves', id);
                    await deleteDoc(shelfRef);
                    const albumRef = collection(db, 'albums');
                    const q = query(albumRef, where('shelf','==',id));
                    const querySnapshot = await getDocs(q);
                    const batch = writeBatch(db);
                    querySnapshot?.forEach((doc) => {
                        batch.delete(doc.ref);
                    })
                    await batch.commit();
                    return {data:null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            invalidatesTags: ['Shelf']
        }),
        changeShelfName: builder.mutation({
            async queryFn({id, currentName}) {
                try {
                    await updateDoc(doc(db,'shelves',id), {
                        name: currentName
                    });
                    return {data: null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            }
        }),
        reorderShelves: builder.mutation({
            async queryFn(shelvesToReorder) {
                try {
                    const batch = writeBatch(db);
                    shelvesToReorder.forEach((shelf: {id: string, index: number}) => {
                        const ref = doc(db, 'shelves', shelf.id);
                        batch.update(ref, {order: shelf.index});
                    });
                    await batch.commit();
                    return {data: null};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            },
            async onQueryStarted(shelvesToReorder, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getShelves', undefined, (draft) => {
                        shelvesToReorder.forEach((shelf: {id: string, index: number}) => {
                            const shelfToUpdate = draft.find(item => item.id === shelf.id);
                            if (shelfToUpdate) {
                                shelfToUpdate.order = shelf.index;
                            }
                        })
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
    })
})

export const { 
    useGetAlbumsQuery,
    useAddAlbumMutation,
    useDeleteAlbumMutation,
    useReorderAlbumsMutation,
    useGetShelvesQuery,
    useAddShelfMutation,
    useDeleteShelfMutation,
    useChangeShelfNameMutation,
    useReorderShelvesMutation 
} = firestoreApi;