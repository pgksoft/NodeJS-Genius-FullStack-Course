import request from 'supertest';
import { expect } from 'chai';
import { createApp } from '@infra/app';
import apiAuthUrl from '@api/const/api-url';
import { TaskModel, type TTaskCreateDto } from '@domain/tasks/model';
import { getBasicAuthHeader } from 'tests/helpers/get-basic-auth-header';
import { TASK_API_TITLES, TEST_VAR } from 'tests/helpers/const';
import { UserModel } from '@domain/users/model';
import { TaskStatusLogModel } from '@domain/tasks/inner-entities/task-status-log/model';
import { logger } from '@logger/index';

const { email, password } = TEST_VAR.userAdmin;

describe('Task API', () => {
  const app = createApp();
  // CREATE
  it(TASK_API_TITLES.itCreateTask, async () => {
    const taskStatusRes = await request(app)
      .post(apiAuthUrl.taskStatusDic)
      .set('Authorization', getBasicAuthHeader(email, password))
      .send(TEST_VAR.taskStatusMutationDto);

    const res = await request(app)
      .post(apiAuthUrl.task)
      .set('Authorization', getBasicAuthHeader(email, password))
      .send({
        description: TASK_API_TITLES.nameTask,
        completed: false,
        taskStatusEventId: taskStatusRes.body._id,
        comment: TASK_API_TITLES.itCreateTask,
      } satisfies TTaskCreateDto);

    logger.info(res.body, TASK_API_TITLES.itCreateTask);

    expect(res.status).to.equal(201);
    expect(res.body.description).to.equal(TASK_API_TITLES.nameTask);

    expect(res.body.taskStatusEventId).to.be.an('object');
    expect(res.body.taskStatusEventId.taskStatusId).to.be.an('object');
    expect(res.body.taskStatusEventId.createBy).to.be.an('object');

    const eventInDb = await TaskStatusLogModel.findById(res.body.taskStatusEventId._id);
    expect(eventInDb).to.not.be.null;
  });

  // READ (all)
  it(TASK_API_TITLES.itGetTasks, async () => {
    const admin = await UserModel.findOne({ email: TEST_VAR.userAdmin.email }).lean();
    await TaskModel.create({ description: 'Task 1', createBy: admin?._id });
    await TaskModel.create({ description: 'Task 2', createBy: admin?._id });

    const res = await request(app)
      .get(apiAuthUrl.task)
      .set('Authorization', getBasicAuthHeader(email, password))
      .expect(200);

    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(2);
  });

  // READ (by id)
  it('Should get a task by id', async () => {
    const admin = await UserModel.findOne({ email: TEST_VAR.userAdmin.email }).lean();
    const task = await TaskModel.create({ description: 'Single Task', createBy: admin?._id });

    const res = await request(app)
      .get(`${apiAuthUrl.task}/${task._id}`)
      .set('Authorization', getBasicAuthHeader(email, password))
      .expect(200);

    expect(res.body.description).to.equal('Single Task');
  });

  // UPDATE
  it('Should update a task', async () => {
    const admin = await UserModel.findOne({ email: TEST_VAR.userAdmin.email }).lean();
    const task = await TaskModel.create({ description: 'Old Title', createBy: admin?._id });

    const res = await request(app)
      .put(`${apiAuthUrl.task}/${task._id}`)
      .set('Authorization', getBasicAuthHeader(email, password))
      .send({ description: 'New Title' })
      .expect(200);

    expect(res.body.description).to.equal('New Title');
  });

  // DELETE
  it('Should delete a task', async () => {
    const admin = await UserModel.findOne({ email: TEST_VAR.userAdmin.email }).lean();
    const task = await TaskModel.create({ description: 'To Delete', createBy: admin?._id });

    await request(app)
      .delete(`${apiAuthUrl.task}/${task._id}`)
      .set('Authorization', getBasicAuthHeader(email, password))
      .expect(204);

    const found = await TaskModel.findById(task._id);
    expect(found).to.be.null;
  });

  // VALID DTO
  it('Should return 400 for invalid DTO', async () => {
    const res = await request(app)
      .post(apiAuthUrl.task)
      .set('Authorization', getBasicAuthHeader(email, password))
      .send({ wrongField: 'oops' });

    expect(res.status).to.equal(400);
  });

  // VALID ID LIKE ObjectId
  it('Should return 400 for invalid ObjectId', async () => {
    const res = await request(app)
      .get(`${apiAuthUrl.task}/not-an-id`)
      .set('Authorization', getBasicAuthHeader(email, password));
    expect(res.status).to.equal(400);
  });
});
