import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const setToken = useAuthStore((s) => s.setAccessToken)
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await api.post('/api/auth/login', data)
    setToken(res.data.accessToken)
    navigate('/tasks')
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border border-slate-700 p-6">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input className="w-full rounded border border-slate-600 bg-slate-900 p-2" placeholder="Email" {...register('email')} />
        <input className="w-full rounded border border-slate-600 bg-slate-900 p-2" type="password" placeholder="Password" {...register('password')} />
        <button className="w-full rounded bg-emerald-600 px-3 py-2 font-semibold" disabled={formState.isSubmitting} type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
