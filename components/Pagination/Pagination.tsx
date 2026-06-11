import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
  forcePage: number;
}

interface SelectedPage {
  selected: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange, forcePage }) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={(selectedItem: SelectedPage) => onPageChange(selectedItem.selected)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      forcePage={forcePage}
    />
  );
};

export default Pagination;