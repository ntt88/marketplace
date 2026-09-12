'use client';
import {registerUser} from "@/app/actions/authActions";
import {signIn} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await registerUser(email, password);
    if (result.error) {
      setSubmitting(false);
      setError(result.error);
      return;
    }

    await signIn('credentials', {email, password, redirect: false});
    setSubmitting(false);
    router.push('/');
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-16 flex flex-col gap-4">
      <h1 className="text-lg font-bold">Sign up</h1>
      <form action={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="border rounded p-2"/>
        <input name="password" type="password" placeholder="Password" required minLength={8} className="border rounded p-2"/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={submitting}
          className={(submitting ? 'bg-gray-400' : 'bg-blue-600') + " text-white px-6 py-2 rounded"}>
          {submitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      <p className="text-sm text-gray-500">
        Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link>
      </p>
    </div>
  );
}
