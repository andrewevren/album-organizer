import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, query, where, doc, getDocs, updateDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AlbumSchema, ShelfSchema } from 'src/types/types';

//TODO: replace generic object type with album and shelf interfaces
export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Album', 'Shelf'],
    endpoints: builder => ({
        getAlbums: builder.query<object, string> ({
            async queryFn(user) {
                try {
                    const ref = collection(db, 'albums');
                    const q = query(ref, where('uid','==',user))
                    const querySnapshot = await getDocs(q);
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
            async onQueryStarted({id, user}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getAlbums', user, (draft) => {
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
            async queryFn({albumsToReorder, user}) {
                try {
                    console.log(albumsToReorder)
                    console.log(user)
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
            async onQueryStarted({albumsToReorder, user}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getAlbums', user, (draft) => {
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
        getShelves: builder.query<object, string> ({
            async queryFn(user) {
                try {
                    const ref = collection(db, 'shelves');
                    const q = query(ref, where('uid','==',user))
                    const querySnapshot = await getDocs(q);
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
            async queryFn({newOrder, user}) {
                try {
                    const ref = collection(db, 'shelves');
                    await addDoc(ref, {
                        name: "My New Shelf",
                        order: newOrder,
                        uid: user
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
            async queryFn({shelvesToReorder}) {
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
            async onQueryStarted({shelvesToReorder, user}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    firestoreApi.util.updateQueryData('getShelves', user, (draft) => {
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
        })
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