
const { createUserName, removeUserName } = require('../io/io-utils');

const { expect } = require('chai');




describe('Test of io-utils', function() {
  let mockList = [];
  describe('Test of create-userName', function() {
    let evokeCreateUserName = createUserName.bind(this, mockList, 'thomas', 1);

    it('should add user thomas', function() {
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(1);
      expect(mockList).to.contain('thomas');
    });

    it('second call with same user should add thomas1', function() {
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(2);
      expect(mockList).to.contain('thomas1');
    });
    it('third call should add thomas11', function(){
      mockList.push(evokeCreateUserName());
      expect(mockList).to.be.length(3);
      expect(mockList).to.contain('thomas11');
    });
  })

  describe('Test that remove user name function', function() {
    it('should remove thomas', function() {
      //Check that is thomas mocked to delete
      expect(mockList).to.contain('thomas');
      removeUserName(mockList, 'thomas');

      expect(mockList).to.not.contain('thomas');
      expect(mockList).to.contain('thomas1');

    })
  })
})