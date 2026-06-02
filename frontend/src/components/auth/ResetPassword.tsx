'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import api from '@/api/axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

export default function ResetPasswordPage() {
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Securely extract token parameters from raw window search location matrix
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const tokenParam = searchParams.get('token');
            setToken(tokenParam);

            if (!tokenParam) {
                setSubmissionError(
                    'Invalid verification parameters. Missing token key entry.',
                );
            }
        }
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Reference password watch variable for matching requirements
    const newPasswordValue = watch('newPassword');

    const navigate = useNavigate();

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setSubmissionError(
                'Invalid verification parameters. Missing token key entry.',
            );
            return;
        }

        setIsSubmitting(true);
        setSubmissionError(null);
        setIsSuccess(false);

        try {
            await api.post(`/api/auth/reset-password?token=${token}`, {
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
                token: token,
            });

            setIsSuccess(true);
            reset();
        } catch (err) {
            if (isAxiosError(err)) {
                setSubmissionError(
                    err?.response?.data?.message ||
                        err?.message ||
                        'A network error occurred. Please try again.',
                );
            } else {
                setSubmissionError('An unexpected execution error occurred.');
            }
        } finally {
            navigate('/signin');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
            {/* Ambient Background Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Core Card Box */}
            <div className="relative w-full max-w-md space-y-8 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                {/* Header Layout */}
                <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="bg-primary/10 text-primary border border-primary/20 flex h-14 w-14 items-center justify-center rounded-full">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-foreground text-2xl font-black tracking-tight font-mono uppercase">
                            Reset Password
                        </h2>
                        <p className="text-muted-foreground max-w-xs text-xs font-medium sm:text-sm">
                            Please type a strong password to restore access
                            updates.
                        </p>
                    </div>
                </div>

                {/* Success Banner */}
                {isSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-500 font-mono text-center">
                        Password updated successfully.
                    </div>
                )}

                {/* Error Banner */}
                {submissionError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-bold text-destructive font-mono text-center">
                        {submissionError}
                    </div>
                )}

                {/* Form Elements */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    {/* New Password Input */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="newPassword"
                            className="text-foreground/90 text-xs font-bold tracking-widest uppercase font-mono"
                        >
                            New Password
                        </Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                disabled={isSubmitting || !token}
                                className={`border-border bg-background/40 h-11 rounded-xl pr-4 pl-11 text-sm font-medium font-mono transition-all ${
                                    errors.newPassword
                                        ? 'border-destructive focus-visible:ring-destructive/20'
                                        : 'focus-visible:ring-primary/20'
                                }`}
                                {...register('newPassword', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password must be at least 8 characters long',
                                    },
                                })}
                            />
                        </div>
                        {errors.newPassword && (
                            <p className="text-destructive text-xs font-mono font-bold mt-1">
                                ⚠ {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-foreground/90 text-xs font-bold tracking-widest uppercase font-mono"
                        >
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Lock className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                disabled={isSubmitting || !token}
                                className={`border-border bg-background/40 h-11 rounded-xl pr-4 pl-11 text-sm font-medium font-mono transition-all ${
                                    errors.confirmPassword
                                        ? 'border-destructive focus-visible:ring-destructive/20'
                                        : 'focus-visible:ring-primary/20'
                                }`}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) =>
                                        value === newPasswordValue ||
                                        'Passwords do not match',
                                })}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-destructive text-xs font-mono font-bold mt-1">
                                ⚠ {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Action Button */}
                    <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl text-xs font-black tracking-widest uppercase font-mono shadow-md transition-all active:scale-[0.99]"
                        disabled={isSubmitting || !token}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating data keys...
                            </>
                        ) : (
                            'Save New Password'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
