import type { TTaskStatusMutationDto } from '@domain/tasks/inner-entities/task-status-dic/model';
import { TUserDto } from '@domain/users/model';

export const TEST_VAR = {
  userAdmin: {
    firstName: 'Admin',
    lastName: 'PgkSoft',
    email: 'admin@example.com',
    role: 'admin',
    password: '987654321',
  } satisfies TUserDto,
  taskStatusMutationDto: { name: 'New task', code: 'new' } satisfies TTaskStatusMutationDto,
} as const;

export const TASK_API_TITLES: Record<string, string> = {
  nameTask: 'Task was created fro testing',
  itCreateTask: 'Should create a task',
  itGetTasks: 'Should get all tasks',
};
