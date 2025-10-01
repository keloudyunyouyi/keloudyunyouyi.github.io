import os

# -------------------------- 配置参数（可根据需求修改）--------------------------
# 要遍历的文件夹（后续新增文件夹，直接添加到列表中即可）
TARGET_FOLDERS = ["code-note"]
# 生成的 index.html 路径（固定在仓库根目录，GitHub Pages 会默认读取）
INDEX_PATH = "index.html"
# HTML 页面标题和样式（简单美化，可自定义）
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>我的文档索引</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }}
        .folder {{ margin: 1.5rem 0; }}
        .folder h2 {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; }}
        .file-list {{ list-style: none; padding: 0; margin: 0.5rem 0 0 1.5rem; }}
        .file-list li {{ margin: 0.8rem 0; }}
        .file-list a {{ color: #3498db; text-decoration: none; }}
        .file-list a:hover {{ color: #2980b9; text-decoration: underline; }}
    </style>
</head>
<body>
    <h1>我的文档索引</h1>
    {content}
</body>
</html>
"""
# -----------------------------------------------------------------------------

def get_html_content():
    """生成 index.html 的核心内容（文件夹和文件列表）"""
    content = ""
    for folder in TARGET_FOLDERS:
        # 检查文件夹是否存在
        if not os.path.exists(folder):
            content += f'<div class="folder"><h2>{folder}/（文件夹不存在）</h2></div>'
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
            content += f'<div class="folder"><h2>{folder}/</h2><ul class="file-list">{file_list}</ul></div>'
        else:
            content += f'<div class="folder"><h2>{folder}/</h2><p>暂无 HTML 文件</p></div>'
    
    return content

if __name__ == "__main__":
    # 生成完整 HTML 内容
    html_content = HTML_TEMPLATE.format(content=get_html_content())
    # 写入 index.html 文件
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"✅ index.html 已生成！路径：{os.path.abspath(INDEX_PATH)}")