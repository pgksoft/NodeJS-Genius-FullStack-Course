import { isTaskDto } from '@domain/tasks/model';
import { expect } from 'chai';

describe('isTaskDto', () => {
  it('Should return true for valid taskDto', () => {
    const dto = { description: 'Test task', completed: true };
    expect(isTaskDto(dto)).to.be.true;
  });

  it('Should return false for missing text', () => {
    const dto = { completed: true };
    expect(isTaskDto(dto)).to.be.false;
  });

  it('Should return false for wrong isCompleted type', () => {
    const dto = { description: 'Test', completed: 'yes' };
    expect(isTaskDto(dto)).to.be.false;
  });
});
