import { useState, useMemo } from 'react';

const PAGE_SIZE = 10;

export function usePaginatedSearch(items, searchFields) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }, [items, search, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  return {
    search,
    setSearch: handleSearchChange,
    page: currentPage,
    setPage,
    totalPages,
    paginated,
    totalResults: filtered.length,
  };
}