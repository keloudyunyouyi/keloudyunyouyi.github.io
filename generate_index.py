import os
import json
from datetime import datetime

# -------------------------- 配置参数 --------------------------
TARGET_FOLDERS = ["code-note","开发"]
INDEX_PATH = "index.html"
TEMPLATE_PATH = "template.html"
JSON_PATH = "file-list.json"
# -------------------------------------------------------------

def get_html_content():
    """生成 index.html 的核心内容（文件夹和文件列表）"""
    content = ""
    for folder in TARGET_FOLDERS:
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

        html_files = []
        for filename in os.listdir(folder):
            if filename.endswith(".html") and not filename.startswith("."):
                file_url = f"./{folder}/{filename}"
                display_name = filename[:-5]
                html_files.append(f'<li><a href="{file_url}">{display_name}</a></li>')

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

def save_file_list_json():
    """生成 file-list.json 文件"""
    file_data = {}
    for folder in TARGET_FOLDERS:
        if not os.path.exists(folder):
            continue
        file_data[folder] = [
            {
                "url": f"{f}",
                "name": f[:-5]
            }
            for f in os.listdir(folder)
            if f.endswith(".html") and not f.startswith(".")
        ]
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(file_data, f, ensure_ascii=False, indent=2)
    print(f"✅ {JSON_PATH} 已生成！路径：{os.path.abspath(JSON_PATH)}")

def load_template():
    if not os.path.exists(TEMPLATE_PATH):
        print(f"❌ 错误：模板文件 {TEMPLATE_PATH} 不存在")
        return None
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        return f.read()

if __name__ == "__main__":
    html_template = load_template()
    if not html_template:
        exit(1)

    update_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    html_content = html_template.format(
        content=get_html_content(),
        update_time=update_time
    )

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"✅ {INDEX_PATH} 已生成！路径：{os.path.abspath(INDEX_PATH)}")

    # 生成 JSON 文件
    save_file_list_json()
