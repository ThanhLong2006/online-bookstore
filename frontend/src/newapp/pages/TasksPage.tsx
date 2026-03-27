import { useEffect, useState } from 'react'
import { api } from '../api/client'

type Task = {
  id: number
  title: string
  description: string
  status: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    api.get('/api/tasks?page=0&size=10').then((res) => setTasks(res.data.content ?? []))
  }, [])

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <h1 className="mb-4 text-2xl font-bold">My Tasks</h1>
      <div className="space-y-3">
        {tasks.map((task) => (
          <article className="rounded border border-slate-700 p-4" key={task.id}>
            <h2 className="font-semibold">{task.title}</h2>
            <p className="text-sm text-slate-300">{task.description}</p>
            <span className="mt-2 inline-block rounded bg-slate-700 px-2 py-1 text-xs">{task.status}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
