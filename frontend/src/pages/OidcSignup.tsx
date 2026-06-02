import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/api/axios';
import { isAxiosError } from 'axios';
import useAuthStore from '@/store/store';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';

interface SignupType {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const OidcSignup = () => {
    const signin = useAuthStore((state) => state.signin);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // OIDC Specific Params
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');

    const prefilledEmail =
        searchParams.get('email') || location.state?.email || '';

    const [appName, setAppName] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupType>({
        defaultValues: {
            email: prefilledEmail,
            password: '',
            firstName: '',
            lastName: '',
        },
    });

    const onSubmit = async (data: SignupType) => {
        const signupPromise = async () => {
            try {
                const res = await api.post('/o/authenticate/signup', {
                    ...data,
                    client_id: clientId,
                    redirect_uri: redirectUri,
                });

                signin(res.data);

                if (res.data.data?.redirectUrl) {
                    window.location.href = res.data.data.redirectUrl;
                }

                return res.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message ||
                            'Account creation failed',
                        { cause: error },
                    );
                }
                throw error;
            }
        };

        toast.promise(signupPromise(), {
            loading: 'Creating identity...',
            success: 'Profile completed! Redirecting...',
            error: (err) => err.message,
        });
    };

    useEffect(() => {
        const fetchAppName = async () => {
            if (!clientId) return;
            try {
                const res = await api.get(`/api/admin/application/${clientId}`);
                setAppName(res.data.data.name);
            } catch (error) {
                setAppName('Unknown Application');
                console.log(error);
            }
        };
        fetchAppName();
    }, [clientId]);

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-black px-6">
            <div
                onClick={() => navigate(-1)}
                className="fixed p-2 rounded-full top-6 left-6 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer z-50 transition-colors"
            >
                <ArrowLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] space-y-8"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <h1 className="text-3xl">
                                Complete Profile for{' '}
                                <b>{appName || 'Application'}</b>
                            </h1>
                        </div>
                    </div>
                </div>

                <form
                    className="space-y-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex gap-4">
                        <div className="space-y-2 w-full">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                First Name
                            </label>
                            <input
                                {...register('firstName', {
                                    required: 'First name is required',
                                })}
                                className={`flex h-12 w-full rounded-xl border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                                    errors.firstName
                                        ? 'border-red-500 ring-red-500/20'
                                        : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary/20'
                                }`}
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-[11px] text-red-500 ml-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 w-full">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Last Name
                            </label>
                            <input
                                {...register('lastName')}
                                className="flex h-12 w-full rounded-xl border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm transition-all border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                        </label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                            })}
                            type="email"
                            readOnly={!!prefilledEmail}
                            className={`flex h-12 w-full rounded-xl border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                                errors.email
                                    ? 'border-red-500 ring-red-500/20'
                                    : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary/20'
                            } ${prefilledEmail ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="john.doe@example.com"
                        />
                        {errors.email && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Set Password
                        </label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            type="password"
                            className={`flex h-12 w-full rounded-xl border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                                errors.password
                                    ? 'border-red-500 ring-red-500/20'
                                    : 'border-neutral-200 dark:border-neutral-800 focus:ring-primary/20'
                            }`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-[11px] text-red-500 ml-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        variant="btn"
                        type="submit"
                        className="w-full h-12 rounded-xl text-md font-semibold transition-transform active:scale-[0.98]"
                    >
                        Continue
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default OidcSignup;
