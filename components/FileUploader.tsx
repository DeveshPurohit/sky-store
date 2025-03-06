"use client"

import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from '@/lib/actions/file-action';
import { usePathname } from 'next/navigation';


interface PROPS {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: PROPS) => {
  const path = usePathname();

  const[files, setFiles] = useState<File[]>([]);
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const uploadPromises = acceptedFiles.map((file) => {

      if(file.size > MAX_FILE_SIZE) {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));
        return toast({
          title: `${file.name} is too large!`,
          description: "Max file size is 4.5MB",
          className: "error-toast"
        })
      }

      return uploadFile({file, ownerId, accountId, path}).then((uploadedFile) => {
        if(uploadedFile) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
        }
      })
    })

    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleRemoveFile = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button type='button' className={cn("uploader-button", className)}>
      <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload</p>
      </Button>
      {files.length > 0 && <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading..</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={index} className='uploader-preview-item'>
                <div className="flex items-center gap-3">
                <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)}/>
                <div className="preview-item-name">
                  {file.name}
                  <Image width={80} height={26} src={"/assets/icons/file-loader.gif"} alt='Loader'/>
                </div>
                </div>
                <Image src={"/assets/icons/remove.svg"} className='cursor-pointer' width={24} height={24} alt='Remove' onClick={(e) => handleRemoveFile(e, file.name)}/>
              </li>
            )
          })}
        </ul>}
    </div>
  )
}

export default FileUploader