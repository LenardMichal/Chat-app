const _ = require('lodash');
 
exports.createUserName = (list, name, nameIndex) => {
  
  let findResult  = _.find(list, (listedName) => {
    return listedName === name
  })
  if(findResult){
    name += nameIndex;
    this.createUserName(list, name, nameIndex);
  }else{
    return list.push(name);
  }
}

