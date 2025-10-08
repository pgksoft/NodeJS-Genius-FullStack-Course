import request from 'supertest'
import { expect } from 'chai'
import { createApp } from '@infra/app'
import apiUrl from '@api/const/api-url'
import { TaskModel } from '@domain/tasks/model'
import { getBasicAuthHeader } from 'tests/helpers/get-basic-auth-header'
import { TEST_VAR } from 'tests/helpers/const'

describe('Task API', () => {
  const app = createApp()
  // CREATE
  it('should create a task', async () => {
    const res = await request(app)
      .post(apiUrl.task)
      .send({ text: 'New Task', isCompleted: false })

    expect(res.status).to.equal(201)
    expect(res.body.text).to.equal('New Task');
  })

  // READ (all)
  it('should get all tasks', async () => {
    await TaskModel.create({ text: 'Task 1' })
    await TaskModel.create({ text: 'Task 2' })

    const { email, password } = TEST_VAR.userAdmin

    const res = await request(app)
      .get(apiUrl.task)
      .set('Authorization', getBasicAuthHeader(email, password))
      .expect(200)

    expect(res.body).to.be.an('array')
    expect(res.body.length).to.equal(2)
  })

  // READ (by id)
  it('should get a task by id', async () => {
    const task = await TaskModel.create({ text: 'Single Task' })

    const res = await request(app).get(`${apiUrl.task}/${task._id}`).expect(200)

    expect(res.body.text).to.equal('Single Task')
  })

  // UPDATE
  it('should update a task', async () => {
    const task = await TaskModel.create({ text: 'Old Title' })

    const res = await request(app)
      .put(`${apiUrl.task}/${task._id}`)
      .send({ text: 'New Title' })
      .expect(200)

    expect(res.body.text).to.equal('New Title')
  })

  // DELETE
  it('should delete a task', async () => {
    const task = await TaskModel.create({ text: 'To Delete' })

    await request(app).delete(`${apiUrl.task}/${task._id}`).expect(204)

    const found = await TaskModel.findById(task._id)
    expect(found).to.be.null
  })

  // VALID DTO
  it('should return 400 for invalid DTO', async () => {
    const res = await request(app)
      .post(apiUrl.task)
      .send({ wrongField: 'oops' })

    expect(res.status).to.equal(400)
  })

  // VALID ID LIKE ObjectId
  it('should return 400 for invalid ObjectId', async () => {
    const res = await request(app).get(`${apiUrl.task}/not-an-id`)
    expect(res.status).to.equal(400)
  })
})
