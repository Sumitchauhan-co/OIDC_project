import api from '@/api/axios';
import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

interface UserData {
    data: {
        user: User;
    };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoaded: boolean;
    signin: (userData: UserData) => void;
    signout: () => void;
    getUser: () => Promise<void>;
}

const authStore: StateCreator<
    AuthState,
    [['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set) => ({
    user: null,
    isAuthenticated: false,
    isLoaded: false,

    signin: (userData: UserData) => {
        const user = userData?.data.user;
        console.log(user);

        set(
            {
                user: user,
                isAuthenticated: true,
                isLoaded: true,
            },
            false,
            'auth/signin',
        );
    },

    signout: async () => {
        try {
            await api.post('/api/auth/signout');
        } catch (error) {
            console.error(
                'Signout API failed, but clearing local state anyway',
                error,
            );
        } finally {
            setAccessToken(null);

            set(
                {
                    user: null,
                    isAuthenticated: false,
                    isLoaded: true,
                },
                false,
                'auth/signout',
            );
        }
    },

    getUser: async () => {
        try {
            const response = await api.get(`/api/auth/get-user`);

            const result = response.data.data;
            if (result) {
                set(
                    { user: result, isAuthenticated: true, isLoaded: true },
                    false,
                    'auth/getUserSuccess',
                );
            } else {
                set(
                    { user: null, isAuthenticated: false, isLoaded: true },
                    false,
                    'auth/getUserFailed',
                );
            }
        } catch (error) {
            set(
                { user: null, isAuthenticated: false, isLoaded: true },
                false,
                'auth/getUserError',
            );
            setAccessToken(null);
            console.log(error);
        }
    },
});

const useAuthStore = create(
    devtools(
        persist(authStore, {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }),
    ),
);

export default useAuthStore;
