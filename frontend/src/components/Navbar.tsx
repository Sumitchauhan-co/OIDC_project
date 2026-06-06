import { useState } from 'react';
import {
    Navbar as AceternityNavbar,
    NavBody,
    NavItems,
    NavbarButton,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { ModeToggle } from '../theme/ModeToggle';
import icons from '@/utils/Icons';
import useAuthStore from '@/store/store';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = useAuthStore((state) => state.user);
    const signout = useAuthStore((state) => state.signout);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Docs', link: `${import.meta.env.VITE_DOCS_URL}` },
        { name: 'Dashboard', link: '/dashboard' },
    ];

    return (
        <AceternityNavbar className="top-0">
            {/* --- Desktop Layout --- */}
            <NavBody>
                {/* Left side */}
                <div className="flex items-center gap-10">
                    <Link
                        to={'/'}
                        className="flex items-center cursor-pointer"
                    >
                        <icons.Logo className="dark:text-white h-7 w-7" />
                    </Link>

                    <div className="relative">
                        <NavItems items={navLinks} />
                    </div>
                </div>

                {/* Right side Actions */}
                <div className="flex items-center gap-4 z-1">
                    {user ? (
                        <NavbarButton
                            onClick={() => signout()}
                            variant="tertiary"
                        >
                            Signout
                        </NavbarButton>
                    ) : (
                        <NavbarButton
                            variant="tertiary"
                            href="/signin"
                        >
                            Signin
                        </NavbarButton>
                    )}
                    <ModeToggle />
                </div>
            </NavBody>

            {/* --- Mobile Layout --- */}
            <MobileNav>
                <MobileNavHeader>
                    <icons.Logo className="dark:text-white" />
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        />
                    </div>
                </MobileNavHeader>

                <MobileNavMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                >
                    <div className="flex flex-col gap-4 w-full p-4">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.link}
                                className="text-lg font-medium text-neutral-600 dark:text-neutral-300"
                            >
                                {item.name}
                            </a>
                        ))}
                        {user ? (
                            <NavbarButton
                                onClick={() => signout()}
                                variant="tertiary"
                            >
                                Signout
                            </NavbarButton>
                        ) : (
                            <NavbarButton
                                variant="tertiary"
                                href="/signin"
                            >
                                Signin
                            </NavbarButton>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </AceternityNavbar>
    );
};

export default Navbar;
