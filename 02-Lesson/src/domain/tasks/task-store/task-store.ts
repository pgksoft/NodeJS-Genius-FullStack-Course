import { TTasks } from '../entity/task-dto'

const tasks: TTasks = [
  { id: 1, text: 'Go to shop' },
  { id: 2, text: 'Buy car' },
  { id: 3, text: 'Go for jogging' },
  { id: 4, text: 'Read a book' },
  { id: 5, text: 'Call daughter' },
]

const taskStore = { tasks: [...tasks] }

export default taskStore
