
- [ ] 侧边栏复用
- [ ] 侧边栏文件列表
- [ ] 通用的一致性网页生成prompt
- [ ] uml网页展示

```js
    // 第一版：写死——创建HTML侧边栏文件列表
    const fileCard = document.createElement('div');
    fileCard.className = 'sidebar-card';
    fileCard.innerHTML = `
        <div class="sidebar-card-header">
            <i class="fas fa-file-alt"></i>
            <h3>HTML文件</h3>
        </div>
        <div class="sidebar-card-content">
            <ul class="file-list">
                <li><a href="index.html" target="_blank"><i class="fas fa-file-code"></i> index.html</a></li>
                <li><a href="template.html" target="_blank"><i class="fas fa-file-code"></i> template.html</a></li>
                <li><a href="tst.html" target="_blank"><i class="fas fa-file-code"></i> tst.html</a></li>
                <li><a href="code-note/uml介绍.html" target="_blank"><i class="fas fa-file-code"></i> uml介绍.html</a></li>
            </ul>
        </div>
	// 将卡片添加到侧边栏
	// sidebar.appendChild(fileCard);`;
```