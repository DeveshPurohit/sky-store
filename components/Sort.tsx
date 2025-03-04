"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Sort = () => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams && loading) setLoading(false);
  }, [searchParams])

  const handleFilterSelect = (value: string) => {
    setLoading(true);
    router.push(`${path}?sort=${value}`)
  }

  return (
    <Select
      defaultValue={sortTypes[0].value}
      onValueChange={handleFilterSelect}
    >
      <SelectTrigger className="sort-select">
        {loading ?  <div className="flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-4 border-t-transparent border-slate-500 rounded-full"></div>
              </div> : <SelectValue placeholder={sortTypes[0].label} />}
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map(({ label, value }) => (
          <SelectItem key={value} value={value} className="shad-select-item">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
