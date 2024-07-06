"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryParams<T = {}>() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries()) as Partial<T>;
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  function setCategoryParams(category?: string) {
    if (category) {
      urlSearchParams.set("category", category);
    } else {
      urlSearchParams.delete("category");
    }

    replace(`${pathname}?${urlSearchParams.toString()}`);
  }

  return { queryParams, setCategoryParams };
}
