import { useState, useRef, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';
import { getImagesAPI } from '../api';
import { normalizeHits } from '../normalizedHits';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from 'components/Button';
import { Searchbar } from 'components/Searchbar';
import { Loader } from 'components/Loader';
import { AppWrapper, Error } from './App.styled';

const imagesPerPage = 12;

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const abortCtrl = useRef();

  useEffect(() => {
    if (query === '') {
      return;
    }

    const getImages = async () => {
      if (abortCtrl.current) {
        abortCtrl.current.abort();
      }

      abortCtrl.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const data = await getImagesAPI(
          query,
          currentPage,
          imagesPerPage,
          abortCtrl.current.signal
        );

        const normalizedHits = normalizeHits(data.hits);

        setImages(state => [...state, ...normalizedHits]);
        setIsLastPage(currentPage >= Math.ceil(data.totalHits / imagesPerPage));
        setError(null);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getImages();
  }, [currentPage, query]);

  const handleSearchSubmit = newQuery => {
    if (newQuery === query) {
      return;
    }

    setQuery(newQuery);
    setCurrentPage(1);
    setImages([]);
    setError(null);
    setIsLastPage(false);
  };

  const loadMore = () => {
    setCurrentPage(state => state + 1);
  };

  return (
    <AppWrapper>
      <ToastContainer autoClose={2500} />
      <Searchbar onSubmit={handleSearchSubmit} />

      {error && <Error>Error: {error} </Error>}

      <ImageGallery images={images} />

      {isLoading && <Loader />}

      {!isLoading && images.length > 0 && !isLastPage && (
        <Button onClick={loadMore} />
      )}
    </AppWrapper>
  );
};
