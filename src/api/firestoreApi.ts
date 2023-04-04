import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AlbumSchema, ShelfSchema } from 'src/types/types';

//TODO: replace generic object type with album and shelf interfaces
export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: builder => ({
        getAlbums: builder.query<Array<AlbumSchema>, void> ({
            async queryFn() {
                try {
                    const ref = collection(db, 'albums');
                    const querySnapshot = await getDocs(ref);
                    const albums: Array<object> = [];
                    querySnapshot?.forEach((doc) => {
                        albums.push({id: doc.id, ...doc.data()})
                    });
                    return {data: albums};
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            }
        }),
        getShelves: builder.query<Array<ShelfSchema>, void> ({
            async queryFn() {
                try {
                    const ref = collection(db, 'shelves');
                    const querySnapshot = await getDocs(ref);
                    const shelves: Array<object> = [];
                    querySnapshot?.forEach((doc) => {
                        shelves.push({id: doc.id, ...doc.data()})
                    });
                    return {data: shelves}
                } catch (error: any) {
                    console.error(error.message);
                    return {error: error.message};
                }
            }
        })
    })
})

export const { useGetAlbumsQuery } = firestoreApi;