import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useGetCurrentUserQuery } from '../services/simApi';

export const useCurrentUser = () => {
    const dispatch = useDispatch();
    const { currentUser, isLoading, error } = useSelector((state: RootState) => state.user);
    const { refetch } = useGetCurrentUserQuery();

    useEffect(() => {
        if (!currentUser && !isLoading && !error) {
            refetch();
        }
    }, [currentUser, isLoading, error, refetch]);

    return { user: currentUser, isLoading, error };
};
