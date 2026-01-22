import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProfileService } from "@/services/profile.service";
import { ProfilePreview } from "@/types/profile";

export const useProfilesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const query = useQuery<ProfilePreview[]>({
    queryKey: ["profiles-search", debouncedTerm],
    queryFn: () => ProfileService.searchProfiles(debouncedTerm),
    enabled: debouncedTerm.length > 0,
    staleTime: 1000 * 60,
  });

  return {
    searchTerm,
    setSearchTerm,
    ...query,
  };
};
