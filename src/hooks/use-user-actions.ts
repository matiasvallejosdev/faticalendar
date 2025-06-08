import { useAppDispatch } from '@/lib/redux';
import { AppDispatch } from "@/lib/store";
import { UserState, setUserData } from "@/src/lib/features/user-slice";

export function useUserActions() {
    const dispatch = useAppDispatch() as AppDispatch;

    const setUserDataAction = (user: UserState['userData']) => {
        dispatch(setUserData(user));
    };

    return { setUserDataAction };
}