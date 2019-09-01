const { createUserName, removeUserName } = require('../io/io-utils');

const { expect } = require('chai');




describe('Test of io-utils', () => {
  let mockList = [];
  describe('Test of create-userName', () => {
    let evokeCreateUserName = createUserName.bind(this, mockList, 'thomas', 1);

    it('should add user thomas', () => {
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(1);
      expect(mockList).to.contain('thomas');
    });

    it('second call with same user should add thomas1', () => {
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(2);
      expect(mockList).to.contain('thomas1');
    });
    it('third call should add thomas11', () => {
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(3);
      expect(mockList).to.contain('thomas11');
    });
  })

  describe('Test that remove user name function', () => {
    it('should remove thomas', () => {
      //Check that is thomas mocked to delete
      expect(mockList).to.contain('thomas');
      removeUserName(mockList, 'thomas');

      expect(mockList).to.not.contain('thomas');
      expect(mockList).to.contain('thomas1');

    })
  })
})