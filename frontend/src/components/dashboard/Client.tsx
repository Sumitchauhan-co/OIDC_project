import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Icons from '@/utils/Icons';
import api from '@/api/axios';
import { isAxiosError } from 'axios';

export interface ApplicationType {
    id: string;
    name: string;
    clientId: string;
    clientSecret: string;
    ownerId: string;
    isActive: boolean;
    redirectUris: Array<string>;
}

const ClientsPage = () => {
    const navigate = useNavigate();
    const [visibility, setVisibility] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [application, setApplication] = useState<Array<ApplicationType>>([]);

    const toggleVisibility = (id: string) => {
        setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string, label: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(fieldId);
        toast.success(`${label} copied to clipboard`);

        // Reset icon after 2 seconds
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    useEffect(() => {
        const applicationPromise = async () => {
            try {
                const res = await api.get('/api/admin/application');

                setApplication(res.data.data);
                return 'Clients updated';
            } catch (error) {
                let message = 'Server is unreachable';
                if (isAxiosError(error)) {
                    message = error.response?.data?.message || message;
                }
                throw new Error(message, { cause: error });
            }
        };
        toast.promise(applicationPromise(), {
            loading: 'Verifying credentials...',
            success: (msg) => msg,
            error: (err) => `${err.message}`,
        });
    }, []);

    return (
        <section className="p-4 md:p-6 mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        API Clients
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Manage your app credentials and secrets.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/dashboard/apps')}
                    className="bg-black dark:bg-white text-white dark:text-black gap-2"
                >
                    <Icons.Add size={18} />
                    Create New Client
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Icons.Key
                            size={18}
                            className="text-neutral-400"
                        />
                        Active Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-neutral-200 dark:border-neutral-800">
                                <TableHead className="w-[200px] pl-6 text-xs uppercase font-bold text-neutral-400">
                                    Application
                                </TableHead>
                                <TableHead className="text-xs uppercase font-bold text-neutral-400">
                                    Client ID
                                </TableHead>
                                <TableHead className="text-xs uppercase font-bold text-neutral-400">
                                    Client Secret
                                </TableHead>
                                <TableHead className="text-right pr-6 text-xs uppercase font-bold text-neutral-400">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {application?.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="border-neutral-200 dark:border-neutral-800"
                                >
                                    <TableCell className="pl-6 font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-sm">
                                                {client.name}
                                            </span>
                                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
                                                ●{' '}
                                                {client.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Client ID Column */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                                                {client.clientId}
                                            </code>
                                            <button
                                                title="client id"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        client.clientId,
                                                        'Client ID',
                                                        `${client.id}-id`,
                                                    )
                                                }
                                                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                            >
                                                {copiedId ===
                                                `${client.id}-id` ? (
                                                    <Icons.Check
                                                        size={14}
                                                        className="text-emerald-500"
                                                    />
                                                ) : (
                                                    <Icons.Copy size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </TableCell>

                                    {/* Client Secret Column with Eye Toggle */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                                                {visibility[client.id]
                                                    ? client.clientSecret
                                                    : '••••••••••••••••••••••••'}
                                            </code>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        toggleVisibility(
                                                            client.id,
                                                        )
                                                    }
                                                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                                >
                                                    {visibility[client.id] ? (
                                                        <Icons.EyeClose
                                                            size={14}
                                                        />
                                                    ) : (
                                                        <Icons.EyeOpen
                                                            size={14}
                                                        />
                                                    )}
                                                </button>
                                                <button
                                                    title="client secret"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            client.clientSecret,
                                                            'Client Secret',
                                                            `${client.id}-secret`,
                                                        )
                                                    }
                                                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                                >
                                                    {copiedId ===
                                                    `${client.id}-secret` ? (
                                                        <Icons.Check
                                                            size={14}
                                                            className="text-emerald-500"
                                                        />
                                                    ) : (
                                                        <Icons.Copy size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <Icons.Link size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                            >
                                                <Icons.Trash size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Warning Footer */}
            <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
                <div className="p-1 bg-amber-100 dark:bg-amber-500/20 rounded text-amber-600 dark:text-amber-400">
                    <Icons.Key size={16} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                        Security Warning
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-500/80 leading-relaxed">
                        Client secrets grant significant access to your
                        resources. Never share them in public repositories or
                        frontend code. If a secret is compromised, delete the
                        client immediately and generate a new one.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ClientsPage;
