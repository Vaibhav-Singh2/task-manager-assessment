import { Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { AuthLayout } from '../layouts/AuthLayout';

export const RegisterPage = () => {
  return (
    <AuthLayout title="Create account">
      <AuthForm mode="register" />
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="text-blue-700" to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
};
