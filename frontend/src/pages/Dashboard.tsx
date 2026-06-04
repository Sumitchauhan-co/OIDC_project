import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '@/store/store';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, LogIn } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/theme/ModeToggle';

function DashboardContent() {
    const user = useAuthStore((store) => store.user);
    const navigate = useNavigate();
    const signout = useAuthStore((store) => store.signout);

    const userDisplayName = user
        ? `${user.firstName} ${user.lastName}`
        : 'Workspace User';
    const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'W';
    const userEmail = user?.email || 'user@protoauth.internal';

    useEffect(() => {
        if (!user) {
            navigate('/signin');
            toast('Please signin', {
                description: 'You are not authenticated',
                action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo clicked'),
                },
            });
        }
    }, [user, navigate]);

    return (
        <section className="bg-background text-foreground flex min-h-screen w-full antialiased">
            <DashboardSidebar />

            <SidebarInset className="bg-white dark:bg-black flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b px-4 gap-2 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
                    {/* Left Header Actions */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-2" />
                        <span className="text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-400">
                            Dashboard
                        </span>
                    </div>

                    {/* Right Header: Profiler Dropdown Menu Module */}
                    <div className="flex items-center gap-3">
                        <ModeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus-visible:ring-ring rounded-full cursor-pointer outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform active:scale-95 disabled:opacity-50">
                                    <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-800">
                                        <AvatarFallback className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-black font-bold text-xs select-none">
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="bottom"
                                align="end"
                                sideOffset={8}
                                className="border-border/80 bg-popover/95 animate-in fade-in-50 slide-in-from-bottom-1 w-56 rounded-xl shadow-md backdrop-blur-md duration-150"
                            >
                                <DropdownMenuLabel className="p-3 font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-foreground truncate text-xs leading-none font-bold">
                                            {userDisplayName}
                                        </p>
                                        <p className="text-muted-foreground mt-0.5 truncate text-[10px] leading-none font-medium">
                                            {userEmail}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {user ? (
                                    <DropdownMenuItem
                                        onClick={() => signout()}
                                        className="text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        <span>Signout</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => navigate('/signin')}
                                        className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                                    >
                                        <LogIn className="text-muted-foreground h-3.5 w-3.5" />
                                        <span>Signin</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Dynamic View Content Row */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </SidebarInset>
        </section>
    );
}

const Dashboard = () => {
    return (
        <SidebarProvider>
            <DashboardContent />
        </SidebarProvider>
    );
};

export default Dashboard;
