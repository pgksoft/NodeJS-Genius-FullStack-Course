import { isTaskUpdateDto } from '@domain/tasks/model/services/is-task-update-dto';
import { expect } from 'chai';

describe('isTaskUpdateDto', () => {
  it('Should return true for valid taskUpdateDto', () => {
    const dto = { description: 'Test task', completed: true };
    expect(isTaskUpdateDto(dto)).to.be.true;
  });

  it('Should return false for missing text', () => {
    const dto = { completed: true };
    expect(isTaskUpdateDto(dto)).to.be.false;
  });

  it('Should return false for wrong completed type', () => {
    const dto = { description: 'Test', completed: 'yes' };
    expect(isTaskUpdateDto(dto)).to.be.false;
  });
});
