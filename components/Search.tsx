"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file-action";
import { Models } from "node-appwrite";
import FormattedDateTime from "./FormattedDateAndTime";
import Thumbnail from "./Thumbnail";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";

const Search = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setSearchResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      try {
        setLoading(true);
        setOpen(true);
        const res = await getFiles({ types: [], searchText: debouncedQuery });

        setSearchResults(res.documents);
      } catch (error) {
        console.log(error);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) setQuery("");
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setSearchResults([]);
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${debouncedQuery}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {debouncedQuery.length > 0 && (
          <X
            className="cursor-pointer text-gray-600"
            onClick={() => setQuery("")}
          />
        )}
        {open && (
          <ul className="search-result">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-slate-500 rounded-full"></div>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No Files Found!</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
