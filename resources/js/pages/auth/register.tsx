import { Head, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { toast } from 'sonner';

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [formState, setFormState] = useState({
        isLoading: false,
        error: { username: '', email: '', password: '', password_confirmation: '', server: '' },
    });

    const submit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const { email, username, password, password_confirmation } = Object.fromEntries(formData.entries()) as RegisterForm;
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const usernameRegex = /^[a-zA-Z0-9-_]+$/;
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

            if (username.trim().length < 4) {
                return setFormState((prev) => ({ ...prev, error: { ...prev.error, username: 'Username must be at least 4 characters long' } }));
            }
            if (!usernameRegex.test(username)) {
                return setFormState((prev) => ({
                    ...prev,
                    error: { ...prev.error, username: 'Username can only contain letters, numbers, dashes (-), and underscores (_)' },
                }));
            }
            if (!emailRegex.test(email)) {
                return setFormState((prev) => ({ ...prev, error: { ...prev.error, email: 'Invalid email address' } }));
            }
            if (!passwordRegex.test(password)) {
                return setFormState((prev) => ({
                    ...prev,
                    error: { ...prev.error, password: 'Password must contain both letters and numbers' },
                }));
            }
            if (password !== password_confirmation) {
                return setFormState((prev) => ({
                    ...prev,
                    error: { ...prev.error, password_confirmation: 'Passwords do not match' },
                }));
            }
            setFormState((prev) => ({ ...prev, isLoading: true }));
            const res = await fetch('/api/v2/auth/register', { method: 'POST', credentials: 'include', body: formData });
            if (!res.ok) {
                throw new Error('Something went wrong!');
            }
            const result = await res.json();
            if (result.error) {
                throw new Error(result.message);
            }
            toast('Registration successful');
            form.reset();
            router.get(route('feed'));
        } catch (error) {
            console.log(error);
            const err = error as Error;
            setFormState((prev) => ({ ...prev, error: { ...prev.error, server: err.message } }));
            toast(err.message);
        } finally {
            setFormState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {formState.error.server && <span className="text-center text-sm text-red-500">{formState.error.server}</span>}
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            // required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            placeholder="Full name"
                            name="username"
                        />
                        {formState.error.username && <span className="text-center text-sm text-red-500">{formState.error.username}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            // required
                            tabIndex={2}
                            autoComplete="email"
                            disabled={formState.isLoading}
                            placeholder="email@example.com"
                        />
                        {formState.error.email && <span className="text-center text-sm text-red-500">{formState.error.email}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            // required
                            tabIndex={3}
                            autoComplete="new-password"
                            disabled={formState.isLoading}
                            placeholder="Password"
                        />
                        {formState.error.password && <span className="text-center text-sm text-red-500">{formState.error.password}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            // required
                            tabIndex={4}
                            autoComplete="new-password"
                            disabled={formState.isLoading}
                            placeholder="Confirm password"
                        />
                        {formState.error.password_confirmation && (
                            <span className="text-center text-sm text-red-500">{formState.error.password}</span>
                        )}
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={formState.isLoading}>
                        {formState.isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
