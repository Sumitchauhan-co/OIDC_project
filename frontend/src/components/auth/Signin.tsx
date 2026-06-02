import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import useAuthStore, { setAccessToken } from '@/store/store';
import Icons from '@/utils/Icons';
import { Button } from '../ui/button';

interface Data {
    email: string;
    password: string;
}

const Signin = () => {
    const signin = useAuthStore((state) => state.signin);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: Data) => {
        const signinPromise = async () => {
            try {
                const res = await api.post('/api/auth/signin', data);
                const newToken = res.data.data.accessToken;
                setAccessToken(newToken);
                signin(res.data);
                navigate('/dashboard');
                return res.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message ||
                            'Server is unreachable',
                        { cause: error },
                    );
                }
                throw error;
            }
        };
        toast.promise(signinPromise(), {
            loading: 'Verifying credentials...',
            success: (result) =>
                `Welcome back, ${result.data.user?.firstName}!`,
            error: (err) => `${err.message}`,
        });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-black px-6">
            <Link
                to="/"
                className="fixed p-2 rounded-full top-15 left-15 hover:bg-secondary"
            >
                <Icons.LeftArrow />
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] space-y-8 relative"
            >
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Enter your credentials to access your dashboard
                    </p>
                </div>

                {/* Form */}
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                        </label>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            type="email"
                            placeholder="john.doe@example.com"
                            className={`flex h-12 w-full rounded-md border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                                errors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-400 dark:focus:ring-neutral-700'
                            }`}
                        />
                        <AnimatePresence mode="wait">
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-[12px] font-medium text-red-500 ml-1"
                                >
                                    {errors.email.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Password
                            </label>
                            <NavLink
                                to="/forgot-password"
                                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            >
                                Forgot password?
                            </NavLink>
                        </div>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Minimum 6 characters',
                                },
                            })}
                            type="password"
                            placeholder="••••••••"
                            className={`flex h-12 w-full rounded-md border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 transition-all ${
                                errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-400 dark:focus:ring-neutral-700'
                            }`}
                        />
                        <AnimatePresence mode="wait">
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-[12px] font-medium text-red-500 ml-1"
                                >
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant="btn"
                        type="submit"
                        className="w-full h-12"
                    >
                        Sign In
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-neutral-500">
                    Don't have an account?{' '}
                    <NavLink
                        to="/signup"
                        className="text-neutral-900 dark:text-white font-semibold hover:underline underline-offset-4"
                    >
                        Sign up
                    </NavLink>
                </p>
            </motion.div>
        </div>
    );
};

export default Signin;
