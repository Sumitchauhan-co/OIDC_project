import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'sonner';
import useAuthStore, { setAccessToken } from '@/store/store';
import Icons from '@/utils/Icons';
import { Button } from '../ui/button';

interface Data {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const Signup = () => {
    const signin = useAuthStore((state) => state.signin);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: Data) => {
        const signupPromise = async () => {
            try {
                const res = await api.post('/api/auth/signup', data);
                const params = searchParams.toString();

                const newToken = res.data.data.accessToken;
                setAccessToken(newToken);
                if (params) {
                    navigate(`/oidc/signin?${params}`);
                } else {
                    signin(res.data);
                    navigate('/dashboard');
                }

                return res.data;
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message || 'Registration failed',
                        { cause: error },
                    );
                }
                throw error;
            }
        };

        toast.promise(signupPromise(), {
            loading: 'Creating your ProtoAuth identity...',
            success: (result) =>
                `Account created for ${result.data.user?.firstName}!`,
            error: (err) => `${err.message}`,
        });
    };

    // @ts-expect-error error type?
    const inputClasses = (error) => `
        flex h-12 w-full rounded-md border bg-neutral-50 dark:bg-neutral-900/50 px-4 text-sm 
        text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 transition-all
        ${
            error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-400 dark:focus:ring-neutral-700'
        }
    `;

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
                className="w-full max-w-[450px] space-y-8"
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Create an account
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Join the network and start managing your Auth projects
                    </p>
                </div>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                First Name
                            </label>
                            <input
                                {...register('firstName', {
                                    required: 'First name is required',
                                })}
                                type="text"
                                placeholder="John"
                                className={inputClasses(errors.firstName)}
                            />
                            {errors.firstName && (
                                <p className="text-[11px] text-red-500 ml-1">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Last Name
                            </label>
                            <input
                                {...register('lastName')}
                                type="text"
                                placeholder="Doe"
                                className={inputClasses(errors.lastName)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email Address
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
                            className={inputClasses(errors.email)}
                        />
                        <AnimatePresence>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <input
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password must be at least 8 characters',
                                },
                            })}
                            type="password"
                            placeholder="Create a strong password"
                            className={inputClasses(errors.password)}
                        />
                        <AnimatePresence>
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
                        className="w-full"
                    >
                        Create Account
                    </Button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Already have an account?{' '}
                    <NavLink
                        to="/signin"
                        className="text-neutral-900 dark:text-white font-semibold hover:underline underline-offset-4"
                    >
                        Signin
                    </NavLink>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
