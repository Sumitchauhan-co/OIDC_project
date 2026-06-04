import { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider } from './theme/ThemeProvider';
import AppRoute from './routes/AppRoute';
import useAuthStore from './store/store';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import LoadingAnimation from './shared/LoadingAnimation';

function App() {
    const getUser = useAuthStore((state) => state.getUser);

    // Add a loading state to prevent the routing engine from racing ahead
    const [isHydrating, setIsHydrating] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Handle Verification Alerts
    useEffect(() => {
        const isVerified = searchParams.get('verified');

        if (isVerified === 'true') {
            toast.success('Email verified successfully!', {
                description: 'You can now access all features of your account.',
            });
            searchParams.delete('verified');
            setSearchParams(searchParams, { replace: true });
        } else if (isVerified === 'false') {
            toast.error('Email not verified!', {
                description: `You will be restricted for few features on your account`,
            });
            searchParams.delete('verified');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        async function initializeSession() {
            try {
                await getUser();
            } catch (error) {
                console.error('No active user session found on mount:', error);
            } finally {
                setIsHydrating(false);
            }
        }

        initializeSession();
    }, [getUser]);

    if (isHydrating) {
        return <LoadingAnimation />;
    }

    return (
        <TooltipProvider>
            <ThemeProvider
                defaultTheme="dark"
                storageKey="vite-ui-theme"
            >
                <Toaster
                    theme="dark"
                    position="top-center"
                />
                <AppRoute />
            </ThemeProvider>
        </TooltipProvider>
    );
}

export default App;
