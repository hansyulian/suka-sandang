import { useNavigate } from "react-router-dom";

export function useHandleRedirect() {
  const navigate = useNavigate();
  return (to: string) => {
    navigate(to);
  };
}
