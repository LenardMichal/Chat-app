const _ = require('lodash');
 
// Function that checkcs that name exists in list 
// and appends numbers if duplicates.
// Function return name

exports.createUserName = (list, name, nameIndex) => {
  if(!name){
    name = 'user';
  }
  
  let findResult  = _.find(list, (listedName) => {
    return listedName === name
  });

  if(findResult){
    newName = name + nameIndex;
    return this.createUserName(list, newName, nameIndex);
  }else{
    return name;
  }
}

//returns array w/o name

exports.removeUserName = (list, name) => {
  return _.remove(list, listedName => name === listedName);
}