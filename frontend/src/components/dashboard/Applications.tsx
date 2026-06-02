import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/api/axios';
import { isAxiosError } from 'axios';
import Icons from '@/utils/Icons';
import { Button } from '../ui/button';

interface registerType {
    websiteName: string;
    redirectUris: { value: string }[];
}

const Applications = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            websiteName: '',
            redirectUris: [{ value: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'redirectUris',
    });

    const onSubmit = async (data: registerType) => {
        const formattedData = {
            name: data.websiteName,
            redirectUris: data.redirectUris.map((uri) => uri.value),
        };

        const registrationPromise = async () => {
            try {
                await api.post('/api/admin/application', formattedData);
                navigate('/dashboard/clients');
                return 'Application registered successfully!';
            } catch (error) {
                if (isAxiosError(error)) {
                    throw new Error(
                        error.response?.data?.message ||
                            'Failed to register website',
                        { cause: error },
                    );
                }

                throw error;
            }
        };

        toast.promise(registrationPromise(), {
            loading: 'Registering your application...',
            success: (data) => data,
            error: (err) => err.message,
        });
    };

    return (
        <section className="p-4 md:p-6 space-y-6 mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Application
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Create new client credentials
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12">
                {/* Main Form Card */}
                <Card className="md:col-span-7 lg:col-span-8 border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <CardHeader className="py-4 px-5 border-b border-neutral-100 dark:border-neutral-900">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Icons.Settings
                                size={18}
                                className="text-neutral-400"
                            />
                            General Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Website Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                    Application Name
                                </label>
                                <div className="relative">
                                    <Icons.World
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                                        size={18}
                                    />
                                    <input
                                        {...register('websiteName', {
                                            required:
                                                'Website name is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Minimum 3 characters',
                                            },
                                        })}
                                        type="text"
                                        placeholder="e.g. Acme Marketing Site"
                                        className={`flex h-11 w-full rounded-md border bg-neutral-50 dark:bg-neutral-950/50 pl-10 pr-4 text-sm transition-all outline-none focus:ring-1 ${
                                            errors.websiteName
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-700'
                                        }`}
                                    />
                                </div>
                                {errors.websiteName && (
                                    <p className="text-[11px] text-red-500 font-medium">
                                        {errors.websiteName.message}
                                    </p>
                                )}
                            </div>

                            {/* Redirect URIs */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                        Authorized Redirect URIs
                                    </label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ value: '' })}
                                        className="h-7 text-[11px] gap-1 px-2 border-neutral-200 dark:border-neutral-800"
                                    >
                                        <Icons.Add size={12} />
                                        Add URI
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="space-y-1"
                                        >
                                            <div className="flex gap-2">
                                                <input
                                                    {...register(
                                                        `redirectUris.${index}.value` as const,
                                                        {
                                                            required:
                                                                'URI is required',
                                                            pattern: {
                                                                value: /^https?:\/\/.+/,
                                                                message:
                                                                    'Must start with http:// or https://',
                                                            },
                                                        },
                                                    )}
                                                    placeholder="https://app.com/api/auth/callback"
                                                    className={`flex h-10 w-full rounded-md border bg-neutral-50 dark:bg-neutral-950/50 px-4 text-sm transition-all outline-none focus:ring-1 ${
                                                        errors.redirectUris?.[
                                                            index
                                                        ]
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-700'
                                                    }`}
                                                />
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className="h-10 w-10 p-0 text-neutral-400 hover:text-red-500 border border-neutral-200 dark:border-neutral-800"
                                                    >
                                                        <Icons.Trash
                                                            size={16}
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                            {errors.redirectUris?.[index]
                                                ?.value && (
                                                <p className="text-[10px] text-red-500 font-medium">
                                                    {
                                                        errors.redirectUris[
                                                            index
                                                        ]?.value?.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate(-1)}
                                    className="text-sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-black dark:bg-white text-white dark:text-black font-semibold px-8"
                                >
                                    Register
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Sidebar / Info Sidebar */}
                <div className="md:col-span-5 lg:col-span-4 space-y-4">
                    <Card className="bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/10">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <Icons.Alert size={20} />
                                <span className="text-sm font-bold">
                                    Security Note
                                </span>
                            </div>
                            <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
                                Only requests coming from these registered URIs
                                will be accepted. For local development, you may
                                use{' '}
                                <code className="bg-blue-100 dark:bg-blue-900/30 px-1 rounded">
                                    http://localhost:3000
                                </code>
                                .
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200 dark:border-neutral-800">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                                <Icons.Laptop size={20} />
                                <span className="text-sm font-bold">
                                    What happens next?
                                </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                                After registration, you will receive a{' '}
                                <b>Client ID</b> and <b>Client Secret</b>. Keep
                                the secret safe—it cannot be recovered if lost.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default Applications;
