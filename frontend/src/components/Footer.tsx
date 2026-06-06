import {
    IconBrandX,
    IconBrandLinkedin,
    IconBrandGithub,
} from '@tabler/icons-react';
import Icons from '@/utils/Icons';

const Footer = () => {
    const links = [
        { title: 'Docs', href: `${import.meta.env.VITE_DOCS_URL}` },
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Blog',
            href: 'https://oidc.hashnode.dev/understanding-oauth-open-id-connect-oidc',
        },
        { title: 'Privacy', href: '/legal' },
        { title: 'Terms', href: '/legal' },
        { title: 'Cookies', href: '/legal' },
    ];

    const socialLinks = [
        { icon: <IconBrandX size={20} />, href: 'https://x.com/SUMITCH433' },
        {
            icon: <IconBrandLinkedin size={20} />,
            href: 'https://www.linkedin.com/in/sumit-chauhan-10679a384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        },
        {
            icon: <IconBrandGithub size={20} />,
            href: 'https://github.com/Sumitchauhan-co',
        },
    ];

    return (
        <footer className="w-full bg-white dark:bg-black py-16 px-6 border-t border-neutral-200 dark:border-neutral-900">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Brand name */}
                <div className="flex items-center gap-2 mb-8">
                    <Icons.Logo className="text-black dark:text-white" />
                    <span className="text-black dark:text-white font-bold tracking-widest text-lg">
                        <p>ProtoAuth </p>
                    </span>
                </div>

                {/* --- Navigation --- */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
                    {links.map((link) => (
                        <a
                            key={link.title}
                            href={`${link.href}`}
                            className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors text-sm font-medium"
                        >
                            {link.title}
                        </a>
                    ))}
                </nav>

                {/* --- dotted line --- */}
                <div className="relative w-full mb-8">
                    <div className="w-full border-t border-neutral-600 border-dashed" />

                    <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />

                    <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />
                </div>

                {/* --- Bottom Bar --- */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                        © {new Date().getFullYear()} ProtoAuth
                    </p>

                    <div className="flex items-center gap-6">
                        {socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                className="text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-all transform hover:scale-110"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
