const { createUserName } = require('../io/io-utils');

const { expect } = require('chai');




describe('Test of io-utils', () => {
  describe('Test of create-userName', () => {
    let mockList = [];
    let evokeCreateUserName = createUserName.bind(this, mockList, 'thomas', 1);
    it('should add user thomas', () => {
      evokeCreateUserName();
      expect(mockList).to.be.length(1);
      expect(mockList).to.contain('thomas');
    });

    it('second call with same user should add thomas1', () => {
      evokeCreateUserName();
      expect(mockList).to.be.length(2);
      expect(mockList).to.contain('thomas1');
    });
    it('third call should add thomas11', () => {
      evokeCreateUserName();
      expect(mockList).to.be.length(3);
      expect(mockList).to.contain('thomas11');
    });
  })
})