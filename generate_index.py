import os
from datetime import datetime

# -------------------------- 配置参数（可根据需求修改）--------------------------
# 要遍历的文件夹（后续新增文件夹，直接添加到列表中即可）
TARGET_FOLDERS = ["code-note"]
# 生成的 index.html 路径
INDEX_PATH = "index.html"
# HTML 模板文件路径
TEMPLATE_PATH = "template.html"
# -----------------------------------------------------------------------------

def get_html_content():
    """生成 index.html 的核心内容（文件夹和文件列表）"""
    content = ""
    for folder in TARGET_FOLDERS:
        # 检查文件夹是否存在
        if not os.path.exists(folder):
            content += f'''
            <div class="folder-card">
                <div class="folder-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>{folder}/</h2>
                </div>
                <div class="folder-content">
                    <p class="error-message">文件夹不存在</p>
                </div>
            </div>
            '''
            continue
        
        # 遍历文件夹下的 HTML 文件（仅保留 .html，排除子文件夹）
        html_files = []
        for filename in os.listdir(folder):
            # 只保留 .html 文件，且排除隐藏文件（如 .DS_Store）
            if filename.endswith(".html") and not filename.startswith("."):
                # 文件链接：./文件夹名/文件名（相对路径，适配 GitHub Pages）
                file_url = f"./{folder}/{filename}"
                # 显示文件名（去掉 .html 后缀，更友好）
                display_name = filename[:-5] if filename.endswith(".html") else filename
                html_files.append(f'<li><a href="{file_url}">{display_name}</a></li>')
        
        # 生成该文件夹的 HTML 片段
        if html_files:
            file_list = "\n".join(html_files)
            content += f'''
            <div class="folder-card">
                <div class="folder-header">
                    <i class="fas fa-folder"></i>
                    <h2>{folder}/</h2>
                </div>
                <div class="folder-content">
                    <ul class="file-list">
                        {file_list}
                    </ul>
                </div>
            </div>
            '''
        else:
            content += f'''
            <div class="folder-card">
                <div class="folder-header">
                    <i class="fas fa-folder"></i>
                    <h2>{folder}/</h2>
                </div>
                <div class="folder-content">
                    <p class="empty-message">暂无 HTML 文件</p>
                </div>
            </div>
            '''
    
    return content

def load_template():
    """从文件加载HTML模板"""
    if not os.path.exists(TEMPLATE_PATH):
        print(f"❌ 错误：模板文件 {TEMPLATE_PATH} 不存在")
        return None
    
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        return f.read()

if __name__ == "__main__":
    # 加载模板
    html_template = load_template()
    if not html_template:
        exit(1)
    
    # 获取当前时间作为更新时间
    update_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 生成完整 HTML 内容
    html_content = html_template.format(
        content=get_html_content(),
        update_time=update_time
    )
    
    # 写入 index.html 文件
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"✅ index.html 已生成！路径：{os.path.abspath(INDEX_PATH)}")
    