// app/signup/page.tsx
import { AuthForm } from '@/components/auth-form';
import { GuestRoute } from '@/components/GuestRoute';

export default function SignupPage() {
  return (
    <GuestRoute>
      <AuthForm type="signup" />
    </GuestRoute>
  );
}