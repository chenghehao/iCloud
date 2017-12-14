/**
 * 数据
 */

const db = {
  '0': {
    id: 0,
    name: '根目录'
  },
  '1': {
    id: 1,
    pId: 0,
    name: '电影'
  },
  '2': {
    id: 2,
    pId: 0,
    name: '音乐'
  },
  '3': {
    id: 3,
    pId: 1,
    name: '枪战片'
  },
  '4': {
    id: 4,
    pId: 2,
    name: '流行音乐'
  },
  '5': {
    id: 5,
    pId: 2,
    name: '周杰伦'
  },
};
function huifu(){
  localStorage.setItem('fq', JSON.stringify(db));
};

// 根据id获取指定的数据
function getItemById(db, id){
  return db[id];
}

// 根据id设置指定的数据
function setItemById(db, id, data){ 
  const item = db[id];
  item && Object.assign(item, data); 
  localStorage.setItem('fq', JSON.stringify(db));
}

// 根据id获取当前层级的所有文件
function getChildrenById(db, id){
  const data = [];
  for(let key in db){
    const item = db[key];
    if(item.pId === id){
      data.push(item);
    }
  }
  return data;
}

// 根据指定的id找到当前这个文件以及它的所有的父级
function getAllParents(db, id){
  let data = [];
  const current = db[id];
  
  if(current){
    data.push(current);
    data = getAllParents(db, current.pId).concat(data);   //递归
  }
  
  return data;
}

// 根据指定id删除对应的数据以及它所有的子集
function deleteItemById(db, id){
  if(!id) return false;  // 根目录不能删除   根目录的id是0
  delete db[id];        //delete方法可以在直接删除对象的属性和值
  let children = getChildrenById(db, id);
  let len = children.length;
  if(len){
    for(let i=0; i<len; i++){
      deleteItemById(db, children[i].id);   　//递归
    }
  }
  localStorage.setItem('fq', JSON.stringify(wy.db));
  return true;
  
}

// 判断名字是否可用
function nameCanUse(db, id, text){
  const currentData = getChildrenById(db, id);    // getChildrenById(db, id)根据id获取当前层级的所有文件
  return currentData.every(item => item.name !== text);  //返回值是true和flase    （箭头函数）
}

// 添加一条数据
function addOneData(db, data){
  db[data.id] = data;
  localStorage.setItem('fq', JSON.stringify(wy.db));
}

// 判断可否移动数据
function canMoveData(db, currentId, targetId){
  const currentData = db[currentId];
  
  const targetParents = getAllParents(wy.db, targetId);
  
  if(currentData.pId === targetId){
    return 2; // 移动到自己所在的目录
  }
  
  if(targetParents.indexOf(currentData) !== -1){
    return 3;   // 移动到自己的子集
  }
  if(!nameCanUse(db, targetId, currentData.name)){
    return 4; // 名字冲突
  }
  
  return 1;
}
//移动数据到目标点
function moveDataToTarget(db, currentId, targetId){
  db[currentId].pId = targetId;
  localStorage.setItem('fq', JSON.stringify(wy.db));  
}









