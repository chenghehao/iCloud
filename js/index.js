const wy = {
  fsContainer: document.getElementById('fsContainer'),          //存放每个文件夹的父级
  fsItems: document.getElementById('fsContainer').children,     //获取所有的文件夹
  breadCrumb: document.getElementById('breadCrumb'),          //面包屑导航栏
  checkAllBox: document.getElementById('checkAllBox'),    //全选按钮
  checkedFileNum: document.getElementById('checkedFileNum'),   //显示选中多少个文件夹
  reName: document.getElementById('reName'),
  alertInfo: document.getElementById('alertInfo'),     //提示尚未选中文件的地方
  funBtns: document.getElementById('funBtns'),        //删除移动重命名的父级
  emptyInfo: document.getElementById('emptyInfo'),
  rmFile: document.getElementById('rmFile'),
  fsDialog: document.getElementById('fsDialog'),     // 移动文件夹的弹窗
  newDir: document.getElementById('newDir'),          //新建文件夹
  moveFile: document.getElementById('moveFile'),        //移动文件夹
  logos:document.querySelector('.logos'),
  currentListId: 0,
  moveTargetId: 0,
  checkedBuffer: {length: 0},   //建立缓存区，用来存放选中的文件夹数据
  currentBuffer: [],          //当前缓存的文件夹
  refresh:document.querySelector('#shuaxin'),
  parentsBuffer: [],
  shezhi:document.querySelector('#shezhi'),
  db:JSON.parse(localStorage.getItem('fq'))
};


// -------------------------------------------------------------------
// console.log(wy.refresh);

//防止点击多次出现蓝色区域
document.onselectstart=new Function("return false");

// 初始化
intoFolder(wy.currentListId);

//恢复默认的数据
wy.shezhi.onclick = function(){
  huifu();
  // history.go(0);
  location.reload();
}
//点击logo刷新
wy.logos.onclick = function(){
  wy.currentListId = 0;
  intoFolder(wy.currentListId);
};
//点击刷新刷新
wy.refresh.onclick = function(){
  wy.currentListId = 0;
  intoFolder(wy.currentListId);
};
// -------------------------------------------------------------------
// 进入新的界面
function intoFolder(currentListId, sort=2){
  initCheckedFiles();      //选中时进入新页面的初始化
  wy.currentBuffer = createFileList(wy.db, currentListId);   //为当前缓存的文件夹数据
  wy.parentsBuffer = createBreadCrumList(wy.db, currentListId);  //为当前缓存的面包屑数据
  showEmptyInfo();
}

// 生成文件列表
function createFileList(db, id){
  wy.fsContainer.innerHTML = '';
  let data = getChildrenById(db, id);    // 根据id获取当前层级的所有文件，data是当前层级文件夹的集合
  
  // 按中文首字符的拼音进行排序
  data.sort(function (a, b){
    return a.name[0].localeCompare(b.name[0], 'zh');
  });
  
  //为fsContainer内容里添加生成的文件夹
  data.forEach(function(item, i) {    
    wy.fsContainer.appendChild(createFileNode(item));
  });
  return data;
}

// 生成面包削导航
function createBreadCrumList(db, id){
  wy.breadCrumb.innerHTML = '';
  var data = getAllParents(db, id);  // // 根据指定的id找到当前这个文件以及它的所有的父级
  data.forEach(function(item, i) {
    wy.breadCrumb.appendChild(createBreadCrumbNode(item))
  });
  return data;
}

// -------------------------------------------------------------------
// 进入文件夹和选中文件夹
wy.fsContainer.addEventListener('click', function (e){
  const target = e.target;
  if(target.classList.contains('file-img') || target.classList.contains('file-wrap')){
    intoFolder(wy.currentListId = target.fileId);  // 进入新的界面
  }
  if(target.classList.contains('file-check-click')){
    checkNodeData(target.parentNode);
  }
});

// 面包削导航跳转
wy.breadCrumb.addEventListener('click', function (e){
  const target = e.target;
  if(target.fileId !== undefined && wy.currentListId !== target.fileId){
    intoFolder(wy.currentListId = target.fileId);
  }
});

// -------------------------------------------------------------------
// 单选和全选
function checkNodeData(checkNode){
  const {fileId} = checkNode;    
  const checked = checkNode.classList.toggle('checked');   // 值为true或flase
  const {checkedBuffer, checkAllBox, checkedFileNum, fsItems} = wy;   //声明下这些变量都在wy中
  const len = fsItems.length;     //当前生成文件夹的个数
  
  if(checked){      //如果以及选中
    checkedBuffer[fileId] = checkNode;
    checkedBuffer.length++;
  }else{
    delete checkedBuffer[fileId];
    checkedBuffer.length--;
  }
  
  const checkedLen = checkedFileNum.innerHTML = checkedBuffer.length;   //显示选中了多少个文件夹

 //全选按钮选中时，文件夹的的个数等于当前生成是所有文件夹
  checkAllBox.classList.toggle('checked', checkedLen === len);  
}

// 全选功能
wy.checkAllBox.addEventListener('click', function (e){
  const isChecked = this.classList.toggle('checked');     // 值为true或flase
  toggleCheckAll(isChecked);    
});


//选中时进入新页面的初始化
function initCheckedFiles(){
  if(wy.checkedBuffer.length > 0){
    wy.checkAllBox.classList.remove('checked');
    toggleCheckAll(false);
  }
}

function toggleCheckAll(isChecked){
  const {fsContainer, checkedBuffer, checkedFileNum, fsItems} = wy;   //声明下这些变量都在wy中
  
  const len = fsItems.length;                     //len等于当前生成文件夹的数量
  
  if(isChecked){
    checkedBuffer.length = checkedFileNum.innerHTML = len;    //显示选中了多少个文件夹
  }else{
    wy.checkedBuffer = {length: 0};
    checkedFileNum.innerHTML = 0;
  }
  
  for(let i=0; i<len; i++){
    const fileItem = fsItems[i].querySelector('.file-wrap');
    const {fileId} = fileItem;
    fileItem.classList.toggle('checked', isChecked);
    if(!checkedBuffer[fileId] && isChecked){
      checkedBuffer[fileId] = fileItem;
    }
  }
}

// -------------------------------------------------------------------
// 重名功能
wy.reName.addEventListener('click', function (e){
  const {checkedBuffer} = wy;          //声明checkedBuffer在wy中
  const len = checkedBuffer.length;    //选中文件夹的个数
  
  if(len > 1){
    return alertMessage('只能选中一个文件', 'error');   //alertMessage是一个函数
  }
  if(!len){
    return alertMessage('尚未选中文件', 'error');
  }
  
  setFileItemName(checkedBuffer, true);     //设置文件名称

});

//设置文件名称
function setFileItemName(checkedBuffer, showMessage, succFn, failFn){
  canUseAllBtns(true);   // 禁用所有功能按钮
  
  const checkedEles = getCheckedFileFromBuffer(checkedBuffer)[0];  // 将选中的元素缓存转成数组
  const {fileId, fileNode} = checkedEles;     
  
  const nameText = fileNode.querySelector('.name-text');
  const nameInput = fileNode.querySelector('.name-input');
  
  dblSetCls(nameInput, nameText, 'show');    //切换显示输入框还是显示文件名的div
  
  const oldName = nameInput.value = nameText.innerHTML;
  nameInput.focus();
  
  nameInput.onblur = function (){       //失去焦点的时候执行的函数
    let newName = this.value.trim();
    if(!newName){
      dblSetCls(nameText, nameInput, 'show');
      this.onblur = null;
      canUseAllBtns(false);   //  启用所有功能按钮
      failFn&&failFn();     //见274行，为参数
      return showMessage&&alertMessage('取消重命名', 'normal');
    }
    if(newName === oldName){
      dblSetCls(nameText, nameInput, 'show');
      this.onblur = null;
      canUseAllBtns(false);
      failFn&&failFn();
      return;
    }
    if(!nameCanUse(wy.db, wy.currentListId, newName)){    // 判断名字是否可用
      this.select();            //select() 方法用于选取密码域中的文本。
      return showMessage&&alertMessage('命名冲突', 'error');
    }
    nameText.innerHTML = newName;
    dblSetCls(nameText, nameInput, 'show');
    
    setItemById(wy.db, fileId, {name: newName});   // 根据id设置指定的数据
    
    showMessage&&alertMessage('命名成功', 'success');
    this.onblur = null
    canUseAllBtns(false);
    succFn&&succFn(newName);
  };
  
  window.onkeyup = function (e){
    if(e.keyCode === 13){
      nameInput.blur();
      this.onkeyup = null;
    }
  };
};

function dblSetCls(show, hidden, cls){
  show.classList.add(cls);
  hidden.classList.remove(cls);
}

// -------------------------------------------------------------------
// 删除功能
wy.rmFile.addEventListener('click', function (e){
  const {checkedBuffer} = wy;
  const checkedLen = checkedBuffer.length;
  
  if(!checkedLen){
    return alertMessage('未选中任何文件', 'error');
  }
  setDialog('确定要删除么?', () => {
    deletFiles(checkedBuffer);
  }, () => {
    alertMessage('取消删除文件', 'normal');
  });
});

function deletFiles(checkedBuffer){
  const checkedEles = getCheckedFileFromBuffer(checkedBuffer);
  const {fsContainer} = wy;
  
  checkedEles.forEach(function(item, i) {
    const {fileId, fileNode} = item;
    
    fsContainer.removeChild(fileNode.parentNode);
    
    wy.checkedBuffer.length--;
    
    delete wy.checkedBuffer[fileId];     //删除缓存
    
    deleteItemById(wy.db, fileId);     //删除数据
      // localStorage.setItem('fq', JSON.stringify(wy.db));
  });
  showEmptyInfo();      // 是否显示目录为空的提示
  alertMessage('删除成功', 'success');
}

// -------------------------------------------------------------------
// 新建文件夹
wy.newDir.addEventListener('click', function (e){
  initCheckedFiles();
  
  const {currentListId, fsContainer, checkedBuffer} = wy;
  
  const newFolderData = {
    id: Date.now(),
    name: '',
    pId: wy.currentListId
  };
  
  const newFolderNode = createFileNode(newFolderData);
  
  const fileWrap = newFolderNode.querySelector('.file-wrap');
  
  fsContainer.insertBefore(newFolderNode, fsContainer.firstElementChild); //insertBefore() 方法在您指定的已有子节点之前插入新的子节点。
  
  checkNodeData(fileWrap);
  
  showEmptyInfo();   // 是否显示目录为空的提示
  
  setFileItemName(     //  为succFn, failFn         设置文件名
    checkedBuffer,
    false,
    (name) => {
      newFolderData.name = name;
      addOneData(wy.db, newFolderData);
      // localStorage.setItem('fq', JSON.stringify(wy.db));
      showEmptyInfo();
      alertMessage('新建操作成功', 'success');
    },
    () => {
      fsContainer.removeChild(newFolderNode);
      initCheckedFiles();
      showEmptyInfo();
      alertMessage('取消新建操作', 'normal');
    }
  );
});

// -------------------------------------------------------------------
// 移动文件
wy.moveFile.addEventListener('click', function (e){
  const {checkedBuffer} = wy;
  const len = checkedBuffer.length;
  
  if(!len){
    return alertMessage('尚未选中文件', 'error');
  }
  
  setMoveFileDialog(sureFn, cancelFn);
  
  function sureFn(){
    const {fsContainer} = wy;
    const checkedEles = getCheckedFileFromBuffer(checkedBuffer);
    
    let canMove = true;
    
    for(let i=0, len=checkedEles.length; i<len; i++){
      const {fileId, fileNode} = checkedEles[i];
      const ret = canMoveData(wy.db, fileId, wy.moveTargetId);
      if(ret === 2){
        return alertMessage('已经在当前目录', 'error');
        canMove = false;
      }
      if(ret === 3){
        return alertMessage('不能移动到子集', 'error');
        canMove = false;
      }
      if(ret === 4){
        return alertMessage('存在同名文件', 'error');
        canMove = false;
      }
    }
    if(canMove){
      checkedEles.forEach(function(item, i) {
        const {fileId, fileNode} = item;
        moveDataToTarget(wy.db, fileId, wy.moveTargetId);
        fsContainer.removeChild(fileNode.parentNode);
      });
      initCheckedFiles();
      showEmptyInfo();
    }
  }
  function cancelFn(){
    alertMessage('取消移动文件', 'normal')
  }
});

function setMoveFileDialog(sureFn, cancelFn){
  const {fsDialog, currentListId} = wy;
  
  const treeListNode = createFileMoveDialog(createTreeList(wy.db, 0, currentListId));
  
  fsDialog.appendChild(treeListNode);
  
  fsDialog.classList.add('show');    //放大一倍，透明度变为1，也就是显示出来了
  
  const fileMoveWrap = document.querySelector('.file-move');     //弹窗
  //设置弹窗的位置：
  fileMoveWrap.style.left = (fileMoveWrap.parentNode.clientWidth - fileMoveWrap.offsetWidth) / 2 + 'px'; 
  fileMoveWrap.style.top = (fileMoveWrap.parentNode.clientHeight - fileMoveWrap.offsetHeight) / 2 + 'px'; 
  //设置弹窗的拖拽
  dragEle({
    downEle: fsDialog.querySelector('.modal-header'),
    moveEle: fsDialog.querySelector('.file-move')
  });
  
  const listTreeItems = document.querySelectorAll('#fsListTree div');   //弹窗里每个横条文件夹
  
  let prevActive = currentListId;
  
  for(let i=0, len=listTreeItems.length; i<len; i++){
    listTreeItems[i].onclick = function (){
      listTreeItems[prevActive].classList.remove('active');
      this.classList.add('active');
      prevActive = i;
      wy.moveTargetId = this.dataset.fileId * 1;
    };
    
    listTreeItems[i].firstElementChild.onclick = function (){
      const allSiblings = [...this.parentNode.parentNode.children].slice(1);
      
      if(allSiblings.length){
        allSiblings.forEach(function(item, i) {
          item.style.display = item.style.display === '' ? 'none' : '';
        });
      }
      this.classList.toggle('glyphicon-folder-open');
      this.classList.toggle('glyphicon-folder-close');
    }
  }
  
  const sureBtn = fsDialog.querySelector('.sure');        // 确定
  const cancelBtn = fsDialog.querySelector('.cancel');    //取消
  const closeBtn = fsDialog.querySelector('.close');    // X号
  
  sureBtn.onclick = function (){
    sureFn&&sureFn();
    closeTreeList();
  };
  cancelBtn.onclick = closeBtn.onclick = function (e){
    cancelFn&&cancelFn();
    closeTreeList();
  };
  closeBtn.onmousedown = function (e){
    e.stopPropagation();  
  };
  //e.stopPropagation() 不再派发事件。 终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。
  //调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。
  function closeTreeList(){
    fsDialog.classList.remove('show');
    fsDialog.innerHTML = '';
  }
}

// -------------------------------------------------------------------
// 将选中的元素缓存转成数组
function getCheckedFileFromBuffer(checkedBuffer){
  let data = [];
  for(let key in checkedBuffer){
    if(key !== 'length'){
      const currentItem = checkedBuffer[key];
      data.push({
        fileId: parseFloat(key),
        fileNode: currentItem
      });
    }
  }
  return data;
}

// 信息提示功能alertMessage alertMessage alertMessage alertMessage
function alertMessage(text, type){    
  clearTimeout(alertMessage.timer);
  const {alertInfo} = wy;     //alertInfo显示信息的地方（尚未选中文件）
  alertInfo.innerHTML = text;
  alertInfo.classList.add(type);   
  shake({                   //抖动函数
    el: alertInfo,
    times: 10,
    cb(){
      alertMessage.timer = setTimeout(function() {       //延时定时器
        alertInfo.innerHTML = '';
        alertInfo.classList.remove(type);
      }, 2000);
    }
  });
}

// 禁用或启用所有功能按钮
function canUseAllBtns(abled){
  const { funBtns } = wy;
  const btns = funBtns.children;
  for(let i=0; i<btns.length - 1; i++){
    btns[i].disabled = abled;   // disabled = abled 禁用按钮
  }
  if (abled===true){
    return true;
  }
  if (abled===false){
    return false;
  }
}

// 是否显示目录为空的提示
function showEmptyInfo(){
  wy.emptyInfo.classList.toggle('show', !wy.fsItems.length);
}

// 显示警告框功能
function setDialog(message, sureFn, cancelFn){
  const {fsDialog} = wy;
  const fsAlert = fsDialog.appendChild(createWarningInfo(message));
  
  fsDialog.classList.add('show');
  
  const sureBtn = fsAlert.querySelector('.sure-btn');
  const cancelBtn = fsAlert.querySelector('.cancel-btn');
  
  sureBtn.addEventListener('click', function (e){
    sureFn&&sureFn();
    hideDialog();
  });
  
  cancelBtn.addEventListener('click', function (e){
    cancelFn&&cancelFn();
    hideDialog();
  });
  
  function hideDialog(){
    fsDialog.classList.remove('show');
    fsDialog.innerHTML = '';
  }
}

//鼠标画框选中
document.onmousedown = function (e){


  const itemm = wy.fsItems;
  

  
  if(e.target.classList.contains('item')){     //如果点击的元素是div方块时，则return，不执行下面的代码
    return;
  }  
  var div = document.createElement('div');
  div.className = 'kuang';
  document.body.appendChild(div);
  var startX = e.pageX;
  var startY = e.pageY;
  document.onmousemove = function (e){
    var x = e.pageX, y = e.pageY;
    
    var l = Math.min(x, startX);   // 定位是根据左上角，所以选择最小值
    var t = Math.min(y, startY);   // 定位是根据左上角，所以选择最小值
    var w = Math.abs(x - startX);  // 长度就是移动的距离，所以是绝对值
    var h = Math.abs(y - startY);  // 长度就是移动的距离，所以是绝对值
    
    for(var i=0; i<itemm.length; i++){
      if(duang(div, itemm[i])){
        checkNodeData(itemm[i].firstElementChild);
      }
    }
    


    div.style.left = l + 'px';
    div.style.top = t + 'px';
    div.style.width = w + 'px';
    div.style.height = h + 'px';
   
  }
  document.onmouseup = function (e){
    document.body.removeChild(div);
    this.onsmoueup = this.onsmouemove = null;
  }
};