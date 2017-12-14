// 生成当前文件节点
function createFileNode(fileData){
  const fileItem = document.createElement('div');
  fileItem.className = `col-lg-2 col-md-3 col-sm-4 col-xs-12 file-item`;
  fileItem.innerHTML = `<div class="file-wrap">
                          <div class="file-check">
                            <span class="glyphicon glyphicon-ok file-check-active"></span>
                          </div>
                          <div class="file-check-click"></div>
                          <div class="file-img"></div>
                          <div class="file-name">
                            <p class="name-text show" title="${fileData.name}">${fileData.name}</p>
                            <input type="text" class="name-input">  
                          </div>
                        </div>`;
  
  var addFilesIdItems = fileItem.querySelectorAll('div');   //获取生成的文件夹中所有的div
  

   //给获取的每个div加上自定义属性fileId，给每个div加的属性都是相同的，都是他们父级fileItem的ID
  for(var i=0; i<addFilesIdItems.length; i++){   
    addFilesIdItems[i].fileId = fileData.id;
  }
  
  return fileItem;
}

// 生成面包削节点
function createBreadCrumbNode(fileData){
  const item = document.createElement('li');
  const href = document.createElement('a');
  href.fileId = fileData.id;
  href.innerHTML = fileData.name;
  href.href = 'javascript:;';
  item.appendChild(href);
  return item;
}

// 生成对话框
function createWarningInfo(message){
  const fsAlert = document.createElement('div');
  fsAlert.className = `fs-alert`;
  fsAlert.innerHTML = `<div class="modal-dialog ">
                    <div class="modal-content">
                      <div class="modal-body clearfix">
                        <h4 class="title modal-title">${message}</h4>
                        <div class="pull-right ">
                          <button type="button" class="btn btn-default cancel-btn">取消</button>
                          <button type="button" class="btn btn-primary sure-btn">确定</button>
                        </div>
                      </div>
                    </div>
                  </div>`;
  return fsAlert;
}

//生成移动弹窗的列表
function createTreeList(db, id = 0, currentListId){
  const data = db[id];
  const floorIndex = getAllParents(db, id).length;
  const children = getChildrenById(db, id);
  const len = children.length;
  
  let str = `<ul>`;
  
  str += `<li>
            <div data-file-id="${data.id}" class="${currentListId === data.id ? 'active' : ''}" style="padding-left: ${(floorIndex-1)*18}px;">
              <i data-file-id="${data.id}" class="icon glyphicon glyphicon-folder-open"></i>
              <span data-file-id="${data.id}" class="name">${data.name}</span>
            </div>`;
  
  if(len){
    for(let i=0; i<len; i++){
      str += createTreeList(wy.db, children[i].id, currentListId);
    }
  }
  
  return str += `</li></ul>`;
}

//生成移动弹窗
function createFileMoveDialog(treeListHtml){
  const fileMove = document.createElement('div');
  fileMove.classList.add('file-move');
  fileMove.innerHTML = `<div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button type="button" class="close"><span>&times;</span></button>
                              <h4 class="modal-title" id="myModalLabel">选择目标:</h4>
                            </div>
                            <div class="modal-body folder-list">
                              <div class="fs-list-tree" id="fsListTree">
                                ${treeListHtml}
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-default cancel">取消</button>
                              <button type="button" class="btn btn-primary sure">确定</button>
                            </div>
                          </div>
                        </div>`;
  return fileMove;
}
