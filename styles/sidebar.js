// 动态生成侧边栏内容的脚本

// -------------------------- 配置参数（可根据需求修改）--------------------------
// 要遍历的文件夹（后续新增文件夹，直接添加到列表中即可）
const TARGET_FOLDERS = ["code-note"];
// -----------------------------------------------------------------------------

// 等待整个DOM文档加载完成后再执行后续操作
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面布局容器元素，用于放置侧边栏
    const pageLayout = document.querySelector('.page-layout');
    
    // 如果页面布局不存在，使用body作为容器
    const container = pageLayout || document.body;
     
    // 动态生成侧边栏HTML
    generateSidebar(container);
});
 
// 动态生成侧边栏的函数
function generateSidebar(container) {
    // 创建侧边栏容器
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
     
    // 创建文章导航卡片
    const navCard = document.createElement('div');
    navCard.className = 'sidebar-card';
    navCard.innerHTML = `
        <div class="sidebar-card-header">
            <i class="fas fa-file-alt"></i>
            <h3>文章导航</h3>
        </div>
        <div class="sidebar-card-content">
            <ul class="article-toc"></ul>
        </div>
    `;
     
    // 获取文章标题列表的容器
    const tocList = navCard.querySelector('.article-toc');
     
    // 提取一级章节(h2)和二级章节(h3)
    const sections = document.querySelectorAll('h2[id^="section-"]');
    sections.forEach(section => {
        // 创建一级章节项
        const sectionItem = document.createElement('li');
        sectionItem.className = 'toc-section';
        sectionItem.innerHTML = `<a href="#${section.id}" title="${section.textContent}"><i class="fas fa-chevron-right"></i> ${section.textContent}</a>`;
        tocList.appendChild(sectionItem);
         
        // 查找当前一级章节下的所有二级章节(h3)
        const subsections = findSubsections(section);
        if (subsections.length > 0) {
            // 创建二级章节列表并默认隐藏
            const subSectionList = document.createElement('ul');
            subSectionList.className = 'toc-subsection';
            subSectionList.style.display = 'none'; // 默认隐藏二级导航
            
            // 添加所有二级章节
            subsections.forEach(subsection => {
                const subSectionItem = document.createElement('li');
                subSectionItem.innerHTML = `<a href="#${subsection.id}" title="${subsection.textContent}"><i class="fas fa-chevron-right"></i> ${subsection.textContent}</a>`;
                subSectionList.appendChild(subSectionItem);
            });
            
            sectionItem.appendChild(subSectionList);
            // 添加点击事件，控制二级导航的显示与隐藏
            const sectionLink = sectionItem.querySelector('a');
            sectionLink.addEventListener('click', function(e) {
                
                
                // 切换二级导航的显示状态
                if (subSectionList.style.display === 'none') {
                    subSectionList.style.display = 'block';
                } else {
                    subSectionList.style.display = 'none';
                }
            });
        }
    });

    // 将卡片添加到侧边栏
    sidebar.appendChild(navCard);
    
    // 动态生成文件列表卡片并添加到侧边栏
    const fileCard = generateFileListCard();
    sidebar.appendChild(fileCard);
     
    // 将侧边栏添加到页面布局容器
    container.insertAdjacentElement('beforeend', sidebar);
}
 
// 辅助函数：查找当前章节下的所有子章节
function findSubsections(section) {
    const subsections = [];
    let nextElement = section.nextElementSibling;
    
    // 遍历所有后续元素，直到遇到下一个一级章节或文档结束
    while (nextElement && nextElement.tagName !== 'H2') {
        if (nextElement.tagName === 'H3' && nextElement.id) {
            subsections.push(nextElement);
        }
        nextElement = nextElement.nextElementSibling;
    }
    
    return subsections;
}
/**
 * 动态生成文件列表卡片的函数
 */
function generateFileListCard() {
    // 创建文件列表卡片
    const fileCard = document.createElement('div');
    fileCard.className = 'sidebar-card';
    
    // 设置卡片头部
    fileCard.innerHTML = `
        <div class="sidebar-card-header">
            <i class="fas fa-file-alt"></i>
            <h3>文件</h3>
        </div>
        <div class="sidebar-card-content file-list-container">
            <ul class="file-list"></ul>
        </div>
    `;
    
    // 获取文件列表容器
    const fileList = fileCard.querySelector('.file-list');
    
    // 添加滑动样式
    const contentContainer = fileCard.querySelector('.file-list-container');
    contentContainer.style.maxHeight = '300px';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.paddingRight = '5px';
    
    // 添加自定义CSS样式
    const style = document.createElement('style');
    style.textContent = `
        
        /* 彻底移除链接下划线 - 针对::after伪元素 */
        .sidebar-card-content.file-list-container .file-list a::after {
            content: none !important;
            display: none !important;
        }
        
        /* 移除列表项的默认原点 */
        .file-list {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
        }
        
        .file-list li {
            margin-bottom: 5px;
        }
        
        .file-list a {
            color:rgb(0, 0, 0); /* 文字颜色 */
            text-decoration: none;
            display: block;
            padding: 5px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        /* 链接悬停效果 */
        .file-list a:hover {
            color: #007bff; /* 悬停时的文字颜色 */
            background-color: #f8f9fa;
            transform: translateX(3px);
        }
        
        /* 图标样式 */
        .file-list a i {
            margin-right: 8px;
            width: 20px;
            text-align: center;
        }
        
        /* 优化滑动体验 */
        .file-list-container {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
    
    // 存储所有HTML文件链接
    let allHtmlFiles = [];
    
    // 遍历目标文件夹
    TARGET_FOLDERS.forEach(folder => {
        // 尝试获取文件夹中的HTML文件
        // 注意：由于浏览器安全限制，我们不能直接读取文件系统
        // 这里我们使用一种改进的方式：尝试从index.html中提取文件列表
        // 如果index.html中有相应文件夹的内容，我们可以从中提取文件信息
        try {
            // 从index.html的特定元素中提取文件列表
            // 这需要index.html的结构与generate_index.py生成的结构保持一致
            const folderCard = document.querySelector(`.folder-header:has(h2:contains("${folder}/"))`).closest('.folder-card');
            if (folderCard) {
                const fileLinks = folderCard.querySelectorAll('.file-list li a');
                fileLinks.forEach(link => {
                    const fileUrl = link.getAttribute('href');
                    const displayName = link.textContent;
                    allHtmlFiles.push(`<li><a href="${fileUrl}" target="_blank"><i class="fas fa-file-code"></i> ${displayName}</a></li>`);
                });
                return; // 如果成功提取，就不再使用备用方式
            }
        } catch (e) {
            // 如果从index.html提取失败，使用备用的硬编码方式
        }
        
        // 备用方式：模拟文件系统遍历（类似于generate_index.py中的逻辑）
        let filesInFolder = [];
        if (folder === 'code-note') {
            // 这里列出code-note文件夹中的所有HTML文件
            // 当添加新文件时，需要手动更新这里的列表
            filesInFolder = [
                {name: 'ai_prompt_principles.html', display: 'ai_prompt_principles'},
                {name: 'ok.html', display: 'ok'},
                {name: 'ok copy.html', display: 'ok copy'},
                {name: 'ok copy 2.html', display: 'ok copy 2'},
                {name: 'ok copy 3.html', display: 'ok copy 3'},
                {name: 'prompt.html', display: 'prompt'}
            ];
        }
        
        // 为每个文件创建链接
        filesInFolder.forEach(file => {
            if (file.name.endsWith('.html') && !file.name.startsWith('.')) {
                const fileUrl = `../${folder}/${file.name}`;
                const displayName = file.display || (file.name.endsWith('.html') ? file.name.slice(0, -5) : file.name);
                allHtmlFiles.push(`<li><a href="${fileUrl}" target="_blank"><i class="fas fa-file-code"></i> ${displayName}</a></li>`);
            }
        });
    });
    
    // 添加根目录下的HTML文件
    const rootHtmlFiles = [
        {name: 'index.html', display: 'index'},
    ];
    
    rootHtmlFiles.forEach(file => {
        if (file.name.endsWith('.html') && !file.name.startsWith('.')) {
            const fileUrl = `../${file.name}`;
            allHtmlFiles.push(`<li><a href="${fileUrl}" target="_blank"><i class="fas fa-house"></i> home</a></li>`);
        }
    });
    
    // 将文件列表添加到卡片中
    if (allHtmlFiles.length > 0) {
        fileList.innerHTML = allHtmlFiles.join('');
    } else {
        fileList.innerHTML = '<li class="empty-message">暂无HTML文件</li>';
    }
    
    return fileCard;
}

//==============================================================
// 返回顶部按钮功能
const backToTopButton = document.createElement('div');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopButton);

// 监听滚动事件，显示或隐藏返回顶部按钮
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// 点击返回顶部按钮时平滑滚动到页面顶部
backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});