'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyRound, Mail, Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAxiosError } from 'axios';
import api from '@/api/axios';
import { Link } from 'react-router-dom';
import Icons from '@/utils/Icons';

interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: { email: '' },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        const cleanEmail = data.email?.trim();
        if (!cleanEmail) return;

        setIsSubmitting(true);
        setSubmissionError(null);
        setIsSuccess(false);

        try {
            await api.post('/api/auth/forgot-password', data);

            setIsSuccess(true);
            reset();
        } catch (err) {
            if (isAxiosError(err)) {
                setSubmissionError(
                    err?.message ||
                        'A network error occurred. Please try again.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
            {/* Ambient Background Grid */}
            <Link
                to="/"
                className="fixed p-2 rounded-full top-15 left-15 hover:bg-secondary"
            >
                <Icons.LeftArrow />
            </Link>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Core Card Box */}
            <div className="bg-card relative w-full max-w-md space-y-8 rounded-2xl p-8 shadow-2xl dark:bg-zinc-950/40 backdrop-blur-xl">
                {/* Header Layout */}
                <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="bg-primary/10 text-primary border border-primary/20 flex h-14 w-14 items-center justify-center rounded-full">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-foreground text-2xl font-black tracking-tight font-mono uppercase">
                            Forgot password
                        </h2>
                        <p className="text-muted-foreground max-w-xs text-xs font-medium sm:text-sm">
                            Enter your email address and we'll send you a link
                            to restore account access.
                        </p>
                    </div>
                </div>

                {/* Success Banner */}
                {isSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-500 font-mono text-center">
                        Recovery link successfully sent.
                    </div>
                )}

                {/* Error Banner */}
                {submissionError && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-bold text-destructive font-mono text-center">
                        {submissionError}
                    </div>
                )}

                {/* Input Fields & Submit Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-foreground/90 text-xs font-bold tracking-widest uppercase font-mono"
                        >
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="text-muted-foreground/60 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@domain.com"
                                disabled={isSubmitting}
                                className={`border-border bg-background/40 h-11 rounded-xl pr-4 pl-11 text-sm font-medium font-mono transition-all ${
                                    errors.email
                                        ? 'border-destructive focus-visible:ring-destructive/20'
                                        : 'focus-visible:ring-primary/20'
                                }`}
                                {...register('email', {
                                    required: 'Email address is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                            />
                        </div>

                        {/* Error Message */}
                        {errors.email && (
                            <p className="text-destructive text-xs font-mono font-bold mt-1">
                                ⚠ {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Action Submit Button */}
                    <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full rounded-xl text-xs font-black tracking-wider uppercase font-mono shadow-md transition-all active:scale-[0.99]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                </form>

                {/* Return Route Access Link */}
                <div className="pt-2 text-center border-t border-border/40">
                    <a
                        href="/signin"
                        className="text-muted-foreground/80 hover:text-foreground inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                    </a>
                </div>
            </div>
        </div>
    );
}
