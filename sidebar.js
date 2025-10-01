// 动态生成侧边栏内容的脚本

// 等待整个DOM文档加载完成后再执行后续操作
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面布局容器元素，用于放置侧边栏
    const pageLayout = document.querySelector('.page-layout');
     
    // 动态生成侧边栏HTML
    generateSidebar(pageLayout);
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
     
    // 提取并生成文章标题导航
    const articleTitle = document.getElementById('article-title');
    if (articleTitle) {
        // 添加文章主标题
        const titleItem = document.createElement('li');
        titleItem.innerHTML = `<a href="#article-title" title="返回文章开头"><i class="fas fa-chevron-right"></i> ${articleTitle.textContent}</a>`;
        tocList.appendChild(titleItem);
    }
     
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
            // 创建二级章节列表
            const subSectionList = document.createElement('ul');
            subSectionList.className = 'toc-subsection';
            
            // 添加所有二级章节
            subsections.forEach(subsection => {
                const subSectionItem = document.createElement('li');
                subSectionItem.innerHTML = `<a href="#${subsection.id}" title="${subsection.textContent}"><i class="fas fa-chevron-right"></i> ${subsection.textContent}</a>`;
                subSectionList.appendChild(subSectionItem);
            });
            
            sectionItem.appendChild(subSectionList);
        }
    });
     
    // 创建HTML文件列表卡片（保持原样）
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
    `;
     
    // 将卡片添加到侧边栏
    sidebar.appendChild(navCard);
    sidebar.appendChild(fileCard);
     
    // 将侧边栏添加到页面布局容器
    container.insertAdjacentElement('afterbegin', sidebar);
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