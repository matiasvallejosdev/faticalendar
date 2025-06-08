import { useAppSelector } from '@/lib/redux';

export default function useUserState() {
  const state = useAppSelector(state => state.user);
  return state;
}
