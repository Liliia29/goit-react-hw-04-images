import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  SearchBar,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSubmit(query);
  };

  return (
    <SearchBar>
      <SearchForm onSubmit={handleSearchSubmit}>
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>

        <SearchFormInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={query}
          onChange={handleInputChange}
        />
      </SearchForm>
    </SearchBar>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
