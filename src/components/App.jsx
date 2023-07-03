import { useState, useEffect, useRef } from 'react';

import { ToastContainer} from 'react-toastify';
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
    const [isLoading, setIsLoading]  = useState(false),
    const [isLastPage, setIsLastPage] = useState(false);
    const abortCtrl = useState();

    useEffect(() => {
      if ( query === '') {
        return;
      }

      const getImages = async () => {
         
        if (abortCtrl.current) {
          abortCtrl.current.abort();
        }
    
        abortCtrl.current = new AbortController();

        try {
          setIsLoading({ isLoading: true });
    
          const data = await getImagesAPI(
            query,
            currentPage,
            this.abortCtrl.signal
          );
    
          const normalizedHits = normalizeHits(data.hits);
    
          this.setState(prevState => ({
            images: [...prevState.images, ...normalizedHits],
            isLastPage:
              prevState.images.length + normalizedHits.length >= data.totalHits,
            error: null,
          }));
        } catch (error) {
          if (error.code !== 'ERR_CANCELED') {
            this.setState({ error: error.message });
          }
        } finally {
          this.setState({ isLoading: false });
        }
      };
    })

    

    

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }

    this.setState({
      query,
      images: [],
      currentPage: 1,
      error: null,
      isLastPage: false,
    });
  };

  loadMore = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  render() {
    const { images, isLoading, error, isLastPage } = this.state;

    return (
      <AppWrapper>
        <ToastContainer autoClose={2500} />
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {error && <Error>Error: {error} </Error>}

        <ImageGallery images={images} />

        {isLoading && <Loader />}

        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.loadMore} />
        )}
      </AppWrapper>
    );
  }
}
