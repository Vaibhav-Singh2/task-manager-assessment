import { Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { AuthLayout } from '../layouts/AuthLayout';

export const LoginPage = () => {
  return (
    <AuthLayout title="Welcome back">
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-slate-600">
        No account? <Link className="text-blue-700" to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
};
