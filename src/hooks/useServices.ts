import { useQuery } from "@tanstack/react-query";
import { getCategories, getTopServices } from "../lib/queries";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useTopServices() {
  return useQuery({
    queryKey: ["topServices"],
    queryFn: getTopServices,
  });
}
