import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import LoadingAnimation from '@/shared/LoadingAnimation';
import LegalSection from '@/pages/Legal';
import ForgotPasswordPage from '@/components/auth/ForgotPassword';
import ResetPasswordPage from '@/components/auth/ResetPassword';

const Home = lazy(() => import('@/pages/Home'));
const Signin = lazy(() => import('@/components/auth/Signin'));
const Signup = lazy(() => import('@/components/auth/Signup'));
const OidcSignin = lazy(() => import('@/pages/OidcSignin'));
const OidcSignup = lazy(() => import('@/pages/OidcSignup'));
const Docs = lazy(() => import('@/pages/Docs'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DashboardContent = lazy(
    () => import('@/components/dashboard/DashboardContent'),
);
const Applications = lazy(() => import('@/components/dashboard/Applications'));
const Clients = lazy(() => import('@/components/dashboard/Client'));

const AppRoute = () => {
    return (
        // 3. Wrap your entire route tree in Suspense to catch the lazy components
        <Suspense fallback={<LoadingAnimation />}>
            <Routes>
                {/* Public Marketing/Auth routes */}
                <Route element={<AppLayout />}>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/signin"
                        element={<Signin />}
                    />
                    <Route
                        path="/signup"
                        element={<Signup />}
                    />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPasswordPage />}
                    />
                </Route>

                {/* OIDC Auth flows */}
                <Route
                    path="/o/authenticate"
                    element={<OidcSignin />}
                />
                <Route
                    path="/o/authenticate/signup"
                    element={<OidcSignup />}
                />

                {/* Dashboard Panels */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                >
                    <Route
                        index
                        element={<DashboardContent />}
                    />
                    <Route
                        path="apps"
                        element={<Applications />}
                    />
                    <Route
                        path="clients"
                        element={<Clients />}
                    />
                </Route>

                {/* Documentation */}
                <Route
                    path="/docs"
                    element={<Docs />}
                />
                <Route
                    path="/legal"
                    element={<LegalSection />}
                />
            </Routes>
        </Suspense>
    );
};

export default AppRoute;
