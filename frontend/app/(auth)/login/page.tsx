// app/login/page.tsx
import { AuthForm } from '@/components/auth-form';
import { GuestRoute } from '@/components/GuestRoute';


export default function LoginPage() {
  return (
    <GuestRoute>
      <AuthForm type="signin" />
    </GuestRoute>
  );
}