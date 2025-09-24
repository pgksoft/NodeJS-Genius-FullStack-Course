import { isTaskDto } from '@domain/tasks/model'
import { expect } from 'chai'

describe('isTaskDto', () => {
  it('should return true for valid taskDto', () => {
    const dto = { text: 'Test task', isCompleted: true }
    expect(isTaskDto(dto)).to.be.true
  })

  it('should return false for missing text', () => {
    const dto = { isCompleted: true }
    expect(isTaskDto(dto)).to.be.false
  })

  it('should return false for wrong isCompleted type', () => {
    const dto = { text: 'Test', isCompleted: 'yes' }
    expect(isTaskDto(dto)).to.be.false
  })
})
