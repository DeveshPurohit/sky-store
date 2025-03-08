import FileCard from "@/components/FileCard";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file-action";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";
import React from "react";

const TypePage = async ({ params, searchParams }: SearchParamProps) => {
  const type = (await params).type;

  const types = getFileTypesParams(type) as FileType[];
  const searchText = ((await searchParams)?.query as string) || "";
  const sortText = ((await searchParams)?.sort as string) || "";

  const files = await getFiles({ types, searchText, sort: sortText });
  const totalSpace = await getTotalSpaceUsed();

  const getTypeSpace = (types: string[]) => {
    if (types.length < 2) return convertFileSize(totalSpace[types[0]].size);
    else
      return convertFileSize(
        types
          .map((type) => totalSpace[type].size)
          .reduce((total, size) => total + size, 0)
      );
  };

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{getTypeSpace(types)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            <Sort />
          </div>
        </div>
      </section>

      {files.total ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <FileCard key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p>No {type} found!</p>
      )}
    </div>
  );
};

export default TypePage;
