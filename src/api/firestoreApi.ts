import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

//TODO: replace generic object type with album interface
export const firestoreApi = createApi({
    baseQuery: fakeBaseQuery(),
    endpoints: builder => ({
        getAlbums: builder.query<object, void> ({
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
                    return {error: error.message}
                }
            }
        })
    })
})

export const { useGetAlbumsQuery } = firestoreApi;