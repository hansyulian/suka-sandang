import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useBack() {
  const navigate = useNavigate();
  return useCallback(() => {
    return navigate(-1);
  }, [navigate]);
}
