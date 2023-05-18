import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { current } from '@reduxjs/toolkit';
import { collection, query, where, doc, getDocs, updateDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AlbumSchema, ShelfSchema } from 'src/types/types';

//TODO: replace generic object type with album and shelf interfaces
export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Shelf'],
    endpoints: builder => ({
        getAlbums: builder.query<object, string> ({
            async queryFn(id) {
                try {
                    const ref = collection(db, 'albums');
                    const q = query(ref, where('shelf', '==', id));
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
            }
        }),
        reorderAlbums: builder.mutation({
            async queryFn(albumsToReorder) {
                try {
                    
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
                    const sortedShelves = shelves.sort((a,b) => {
                        return a.order - b.order;
                    });
                    return {data: sortedShelves}
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
                    const ref = doc(db, 'shelves', id);
                    await deleteDoc(ref);
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
                        const ref = doc(db, 'shelves', shelf.id)
                        batch.update(ref, {order: shelf.index})
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
                        const shelvesCopy: Array<ShelfSchema> = draft;
                        shelvesToReorder.forEach((shelf: {id: string, index: number}) => {
                            const shelfToUpdate = shelvesCopy.find(item => item.id === shelf.id);
                            if (shelfToUpdate) {
                                shelfToUpdate.order = shelf.index;
                            }
                        })
                        console.log(shelvesCopy)
                        const sortedShelves = shelvesCopy.sort((a,b) => a.order - b.order);
                        return sortedShelves;
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
    useGetShelvesQuery,
    useAddShelfMutation,
    useDeleteShelfMutation,
    useChangeShelfNameMutation,
    useReorderShelvesMutation 
} = firestoreApi;