import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  completed: boolean
  description?: string
  dueDate?: Date
  priority?: 'low' | 'medium' | 'high'
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const updateTaskDetails = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="flex-1"
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
              <div className="ml-auto flex items-center gap-2">
                {task.priority && (
                  <span className={`px-2 py-1 rounded text-sm ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                )}
                {task.dueDate && (
                  <span className="text-sm text-gray-500">
                    Due: {format(task.dueDate, 'MMM d, yyyy')}
                  </span>
                )}
                <Dialog open={isDetailsOpen && selectedTask?.id === task.id} onOpenChange={(open) => {
                  setIsDetailsOpen(open)
                  if (!open) setSelectedTask(null)
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Task Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label>Description</label>
                        <Textarea
                          value={task.description || ''}
                          onChange={(e) => updateTaskDetails(task.id, { description: e.target.value })}
                          placeholder="Add description..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <label>Priority</label>
                        <Select
                          value={task.priority}
                          onValueChange={(value: 'low' | 'medium' | 'high') => 
                            updateTaskDetails(task.id, { priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label>Due Date</label>
                        <Calendar
                          mode="single"
                          selected={task.dueDate}
                          onSelect={(date) => updateTaskDetails(task.id, { dueDate: date })}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}