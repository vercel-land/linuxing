"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchModal } from "./search-modal";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  type: "package" | "category";
}

export function Search() {
  const [results, setResults] = useState<SearchResult[]>([]);

  const fetchResults = useCallback(async (query: string) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    }
  }, []);

  useEffect(() => {
    fetchResults("");
  }, [fetchResults]);

  return <SearchModal results={results} onSearch={fetchResults} />;
}
