import { useAppSelector } from '@/store'; 

export const useAuth = () => {
  const profile = useAppSelector((state) => state.auth.profile); 
  const userId = profile?.id || null;

  return {
    userId,
    profile, 
  };
};

export default useAuth; 