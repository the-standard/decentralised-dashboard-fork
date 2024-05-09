import {
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
  Pagination as DaisyPagination,
} from 'react-daisyui';

import Button from "./Button";

const Pagination = ({
  totalItems,
  perPage,
  currentPage,
  onPageChange,
  className,
}) => {

  const useTotalItems = totalItems || 0;
  const useCurrentPage = currentPage || useTotalPages.length || 0;
  const usePerPage = perPage || 5;
  const useMaxVisiblePages = 5;
  const useTotalPages = Math.ceil(useTotalItems / usePerPage);

  const getLastPageIndex = (total, pageSize) => {
    return Math.floor((total + pageSize - 1) / pageSize); // - 1;
  }

  const getPageIndexOptions = (
    total,
    pageSize,
    maxVisible,
    current
  ) => {
    const options = [];
    const pivot = Math.ceil(maxVisible/2);
    const lastPageIndex = getLastPageIndex(total, pageSize);
  
    if (lastPageIndex <= maxVisible) {
      while (options.length < lastPageIndex) {
        options.push(options.length + 1)
      };
    } else if (current < pivot) {
      while (options.length < maxVisible) {
        options.push(options.length + 1)
      };
    } else if (current > (lastPageIndex - pivot)) {
      while (options.length < maxVisible) {
        options.unshift(lastPageIndex - options.length + 1)
      };
    } else {
      for (var i = current - (pivot - 1); options.length < maxVisible; i++) {
        options.push(i + 1);
      }
    }
  
    return options;
  }

  const showPages = getPageIndexOptions(
    useTotalItems,
    usePerPage,
    useMaxVisiblePages,
    useCurrentPage
  );

  return (
    <DaisyPagination className={className || ''}>
      <Button
        className="join-item"
        size="sm"
        onClick={() => onPageChange( currentPage - 1)}
        disabled={currentPage <= 1 || useTotalItems < 1}
      >
        <ChevronLeftIcon className="h-4 w-4 inline-block"/>
      </Button>

      {showPages.map((value, index) => (
        <Button
          key={index}
          className="join-item"
          size="sm"
          active={currentPage === (index + 1)}
          onClick={() => onPageChange( index + 1)}
        >
          {index + 1}
        </Button>
      ))}

      <Button
        className="join-item"
        size="sm"
        onClick={() => onPageChange( currentPage + 1)}
        disabled={currentPage >= useTotalPages || useTotalItems < 1}
      >
        <ChevronRightIcon className="h-4 w-4 inline-block"/>
      </Button>
    </DaisyPagination>
  );
};

export default Pagination;