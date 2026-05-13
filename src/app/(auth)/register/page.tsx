/* eslint-disable @next/next/no-img-element */
'use client';

import InputField from '@/components/dashboard/Fields/InputField/InputField';
import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import { Button } from '@/components/ui/button';
import { useRegisterUserMutation } from '@/redux/features/auth/auth.api';
import { setAuth } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { setUserProfile } from '@/services/auth/auth.service';
import { TLoginUser } from '@/types/userRole.types';
import { catchAsyncMutation } from '@/utils/apiReqRes.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Zod Schema definition
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Register Data:', data);
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    await catchAsyncMutation(
      registerUser(userInfo).unwrap(),
      // onSuccess
      (res) => {
        const user: TLoginUser = {
          email: res?.data?.user?.email,
          is_admin: res?.data?.user?.is_admin || false,
        };
        dispatch(setAuth({ user }));
        setUserProfile(user, res?.data?.access_token);
        toast.success(res?.message || 'User Registered Successfully');
        setTimeout(() => {
          router.push('/register/stepper');
        }, 1000);
      },
    );
  };

  return (
    <div className="animate-in fade-in flex min-h-screen flex-col items-center justify-center px-4 py-12 duration-700">
      <h2 className="text-primary mb-16 font-serif text-2xl tracking-wide md:text-3xl">
        Transform to Liberation
      </h2>

      <div className="w-full max-w-120 space-y-8 text-center">
        <DynamicSectionHeader
          title="Join the Journey"
          description=" Create an account to save your reflections, get personalized content, and share your own stories."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          <InputField
            label="Your email"
            name="email"
            type="email"
            control={control}
            placeholder="Enter your email"
            error={errors.email?.message}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            control={control}
            placeholder="Enter your password"
            required
            error={errors.password?.message}
          />

          <Button
            disabled={isSubmitting}
            type="submit"
            className={`btn-styles border-primary bg-primary hover:bg-primary/90 w-full text-white disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative flex items-center">
          <div className="border-primary/30 grow border-t"></div>
          <span className="text-primary mx-4 shrink text-xs tracking-widest uppercase">
            or continue with
          </span>
          <div className="border-primary/30 grow border-t"></div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            className="btn-styles border-primary/20 flex items-center justify-center gap-3 border bg-transparent hover:bg-[#F5F1EA]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
            <span className="text-dark-primary font-medium">Sign in with Google</span>
          </Button>
          <Button
            type="button"
            className="btn-styles border-primary/20 flex items-center justify-center gap-3 border bg-black hover:bg-gray-900"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="h-5 w-5 invert"
            />
            <span className="font-medium text-white">Sign in with Apple</span>
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-dark-primary text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-dark-primary text-sm">Continue as guest — 1 item every other day</p>
        </div>
      </div>
    </div>
  );
}
