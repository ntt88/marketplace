'use client';
import {signIn} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError('');
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    setSubmitting(false);
    if (result?.error) {
      setError('Invalid email or password');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-16 flex flex-col gap-4">
      <h1 className="text-lg font-bold">Login</h1>
      <form action={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="border rounded p-2"/>
        <input name="password" type="password" placeholder="Password" required className="border rounded p-2"/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          disabled={submitting}
          className={(submitting ? 'bg-gray-400' : 'bg-blue-600') + " text-white px-6 py-2 rounded"}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-500">
        No account yet? <Link href="/register" className="text-blue-600 underline">Sign up</Link>
      </p>
    </div>
  );
}
