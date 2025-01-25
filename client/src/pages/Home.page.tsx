import { useGetStatusQuery } from '../apiSlice';
import React from 'react';

export function HomePage() {
  const { data, isLoading, isSuccess, isError, error } = useGetStatusQuery();

  return (
    <div>
      <h1>Home Page</h1>
      {isLoading && <p>Loading...</p>}
      {isSuccess && <p>{data.status}</p>}
      {isError && <p>Error: {error.message}</p>}
    </div>
  );
}