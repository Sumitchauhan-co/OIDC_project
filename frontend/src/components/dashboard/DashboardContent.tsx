import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '@/store/store';
import Icons from '@/utils/Icons';
import { isAxiosError } from 'axios';
import api from '@/api/axios';
import type { ApplicationType } from './Client';

interface StatType {
    activeApps: number;
    authRequests: number;
    totalEndUsers: number;
}

const DashboardContent = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const [copied, setCopied] = useState(false);

    const [application, setApplication] = useState<Array<ApplicationType>>([]);

    const [stats, setStats] = useState<StatType>(Object);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const config = [
        {
            label: 'Configure Redirect URIs',
            icon: Icons.Settings,
        },
        {
            label: 'Export Client JSON',
            icon: Icons.Download,
        },
        {
            label: 'Initialize SDK',
            icon: Icons.CircleCheck,
        },
    ];

    const statsUi = [
        {
            key: 'totalEndUsers',
            title: 'Total Users',
            value: '1,284',
            icon: Icons.Users,
            iconColor: 'text-blue-600',
            bg: 'bg-blue-500/10',
        },
        {
            key: 'activeApps',
            title: 'Active Apps',
            value: '12',
            icon: Icons.World,
            iconColor: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
        },
        {
            key: 'totalAuthRequests',
            title: 'Auth Requests',
            value: '45.2k',
            icon: Icons.Fingerprint,
            iconColor: 'text-violet-600',
            bg: 'bg-violet-500/10',
        },
    ];

    const displayStats = statsUi.map((stat) => ({
        ...stat,
        value: stats[stat.key as keyof StatType] || 0,
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, statRes] = await Promise.all([
                    api.get('/api/admin/application'),
                    api.get('/api/admin/stat'),
                ]);

                setApplication(appRes.data.data);
                setStats(statRes.data.data);

                return 'Dashboard updated';
            } catch (error) {
                let message = 'Server is unreachable';

                if (isAxiosError(error)) {
                    console.log(error);
                    message = error.response?.data?.message || message;
                }
                console.log(message);

                throw new Error(message, { cause: error });
            }
        };

        toast.promise(fetchData(), {
            loading: 'Syncing dashboard...',
            success: (data) => data,
            error: (err) => err.message,
        });
    }, []);

    return (
        <section className="p-4 md:p-6 space-y-6 mx-auto">
            {/* Header Section - Streamlined */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, {user?.firstName || 'User'}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Monitor your ecosystem and manage app credentials.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={() => navigate('/dashboard/apps')}
                    className="bg-black dark:bg-white text-white dark:text-black gap-1.5 h-9"
                >
                    <Icons.Add size={16} />
                    New App
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {displayStats?.map((stat, i) => (
                    <Card
                        key={i}
                        className="border-neutral-200 dark:border-neutral-800 shadow-sm"
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                <stat.icon
                                    className={`h-5 w-5 ${stat.iconColor}`}
                                />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
                                    {stat.title}
                                </p>
                                <p className="text-xl font-bold tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-12">
                {/* Recent Applications */}
                <Card className="md:col-span-7 lg:col-span-8 border-neutral-200 dark:border-neutral-800">
                    <CardHeader className="py-4 px-5 border-b border-neutral-100 dark:border-neutral-900">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Recent Applications
                            </CardTitle>
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs text-neutral-500"
                                onClick={() => navigate('/dashboard/clients')}
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="space-y-1">
                            {application.map((app, i) => {
                                if (i > 2) return;
                                const redirectUri =
                                    app.redirectUris?.[0] || '#';

                                const statusClasses = app.isActive
                                    ? 'text-emerald-500 bg-emerald-500/10'
                                    : 'text-neutral-500 bg-neutral-500/10';
                                return (
                                    <div
                                        key={app.id}
                                        className="group flex items-center justify-between p-2.5 px-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                                                <Icons.World
                                                    size={14}
                                                    className="text-neutral-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {app.name}
                                                </p>
                                                <p className="text-[10px] text-neutral-400 font-mono">
                                                    {app.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-[10px] font-bold ${statusClasses} px-1.5 py-0.5 rounded`}
                                            >
                                                {app.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                            <Button
                                                onClick={() =>
                                                    (window.location.href = `${redirectUri}`)
                                                }
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Icons.Link size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* New & Better Issuer Config Card */}
                <Card className="md:col-span-5 lg:col-span-4 border-neutral-200 dark:border-neutral-800 flex flex-col shadow-sm overflow-hidden">
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 px-5 py-3">
                        <div className="flex items-center gap-2">
                            <Icons.Terminal
                                size={16}
                                className="text-neutral-500"
                            />
                            <span className="text-sm font-semibold tracking-tight">
                                Issuer Configuration
                            </span>
                        </div>
                    </div>

                    <CardContent className="p-5 space-y-5 flex-1 flex flex-col">
                        {/* URL Block */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                Public Discovery Endpoint
                            </label>
                            <div className="relative group overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
                                <div className="p-3 pr-10 font-mono text-[10px] text-neutral-600 dark:text-neutral-400 break-all leading-relaxed bg-white dark:bg-neutral-950">
                                    {import.meta.env.VITE_API_URL ||
                                        'https://auth.api.v1'}
                                    /.well-known/openid-configuration
                                </div>
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            `${import.meta.env.VITE_API_URL || 'https://auth.api.v1'}/.well-known/openid-configuration`,
                                        )
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-600"
                                >
                                    {copied ? (
                                        <Icons.Check
                                            size={12}
                                            className="text-emerald-500"
                                        />
                                    ) : (
                                        <Icons.Copy
                                            size={12}
                                            className="text-neutral-500"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Checklist - Better Layout */}
                        <div className="space-y-3 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                Quick Setup
                            </p>
                            <div className="space-y-2.5">
                                {config.map((step, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 group cursor-default"
                                    >
                                        <div className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 group-hover:text-emerald-500 transition-colors">
                                            <step.icon size={14} />
                                        </div>
                                        {step.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <Button
                            size="sm"
                            onClick={() => navigate('/docs')}
                            className="w-full bg-black dark:bg-white text-white dark:text-black mt-auto hover:opacity-90 transition-opacity"
                        >
                            <Icons.Book
                                size={16}
                                className="mr-2"
                            />
                            Read Documentation
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default DashboardContent;
