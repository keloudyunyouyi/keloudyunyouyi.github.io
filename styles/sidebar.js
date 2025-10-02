// 动态生成侧边栏内容的脚本

// -------------------------- 配置参数（可根据需求修改）--------------------------
// JSON 文件路径（Python 脚本会生成这个）
const FILE_LIST_JSON = "../file-list.json";
// -----------------------------------------------------------------------------


// 等待整个DOM文档加载完成后再执行后续操作
document.addEventListener('DOMContentLoaded', function() {
    const pageLayout = document.querySelector('.page-layout');
    const container = pageLayout || document.body;
    generateSidebar(container);
});


// 动态生成侧边栏的函数
function generateSidebar(container) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    // 文章导航卡片
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
    const tocList = navCard.querySelector('.article-toc');

    // 提取文章的 h2/h3
    const sections = document.querySelectorAll('h2[id^="section-"]');
    sections.forEach(section => {
        const sectionItem = document.createElement('li');
        sectionItem.className = 'toc-section';
        sectionItem.innerHTML = `<a href="#${section.id}" title="${section.textContent}"><i class="fas fa-chevron-right"></i> ${section.textContent}</a>`;
        tocList.appendChild(sectionItem);

        const subsections = findSubsections(section);
        if (subsections.length > 0) {
            const subSectionList = document.createElement('ul');
            subSectionList.className = 'toc-subsection';
            subSectionList.style.display = 'none';

            subsections.forEach(subsection => {
                const subSectionItem = document.createElement('li');
                subSectionItem.innerHTML = `<a href="#${subsection.id}" title="${subsection.textContent}"><i class="fas fa-chevron-right"></i> ${subsection.textContent}</a>`;
                subSectionList.appendChild(subSectionItem);
            });

            sectionItem.appendChild(subSectionList);

            // 点击展开/收起二级导航
            const sectionLink = sectionItem.querySelector('a');
            sectionLink.addEventListener('click', function () {
                subSectionList.style.display =
                    subSectionList.style.display === 'none' ? 'block' : 'none';
            });
        }
    });

    sidebar.appendChild(navCard);

    // 动态生成文件列表卡片
    generateFileListCard().then(fileCard => {
        sidebar.appendChild(fileCard);
    });

    container.insertAdjacentElement('beforeend', sidebar);
}


// 辅助函数：查找当前章节下的所有子章节
function findSubsections(section) {
    const subsections = [];
    let nextElement = section.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'H2') {
        if (nextElement.tagName === 'H3' && nextElement.id) {
            subsections.push(nextElement);
        }
        nextElement = nextElement.nextElementSibling;
    }
    return subsections;
}


/**
 * 从 file-list.json 动态生成文件列表卡片
 */
async function generateFileListCard() {
    const fileCard = document.createElement('div');
    fileCard.className = 'sidebar-card';

    fileCard.innerHTML = `
        <div class="sidebar-card-header">
            <i class="fas fa-file-alt"></i>
            <h3>文件</h3>
        </div>
        <div class="sidebar-card-content file-list-container">
            <ul class="file-list"><li>正在加载...</li></ul>
        </div>
    `;

    const fileList = fileCard.querySelector('.file-list');
    const contentContainer = fileCard.querySelector('.file-list-container');
    contentContainer.style.maxHeight = '300px';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.paddingRight = '5px';

    try {
        const res = await fetch(FILE_LIST_JSON);
        const data = await res.json();

        let allHtmlFiles = [];
        // 首页
        allHtmlFiles.push('<li><a href="../index.html"><i class="fas fa-house"></i> home</a></li>');

        // 遍历 JSON 数据
        for (const folder in data) {
            data[folder].forEach(file => {
                allHtmlFiles.push(
                    `<li><a href="${file.url}" target="_blank"><i class="fas fa-file-code"></i> ${file.name}</a></li>`
                );
            });
        }
        fileList.innerHTML = allHtmlFiles.join('');
    } catch (err) {
        console.error("加载文件列表失败:", err);
        fileList.innerHTML = '<li class="empty-message">无法加载文件列表</li>';
    }

    return fileCard;
}


/**
 * 刷新文件列表（从 JSON 重新拉取）
 */
async function refreshFileList() {
    const oldFileCard = document.querySelector('.sidebar-card:nth-child(2)');
    if (oldFileCard) {
        oldFileCard.innerHTML = '<div class="sidebar-card-content"><ul><li>正在刷新...</li></ul></div>';
    }
    const sidebar = document.querySelector('.sidebar');
    const newFileCard = await generateFileListCard();
    if (oldFileCard) {
        sidebar.replaceChild(newFileCard, oldFileCard);
    } else {
        sidebar.appendChild(newFileCard);
    }
}


//==============================================================
// 返回顶部按钮
const backToTopButton = document.createElement('div');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
