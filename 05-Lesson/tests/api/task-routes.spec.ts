import request from 'supertest';
import { expect } from 'chai';
import { createApp } from '@infra/app';
import apiAuthUrl from '@api/const/api-url';
import { TaskModel } from '@domain/tasks/model';
import { getBasicAuthHeader } from 'tests/helpers/get-basic-auth-header';
import { TEST_VAR } from 'tests/helpers/const';
import { UserModel } from '@domain/users/model';

const { email, password } = TEST_VAR.userAdmin;

describe('Task API', () => {
  const app = createApp();
  // CREATE
  it('Should create a task', async () => {
    const res = await request(app)
      .post(apiAuthUrl.task)
      .set('Authorization', getBasicAuthHeader(email, password))
      .send({ description: 'New Task', isCompleted: false });

    expect(res.status).to.equal(201);
    expect(res.body.description).to.equal('New Task');
  });

  // READ (all)
  it('Should get all tasks', async () => {
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
