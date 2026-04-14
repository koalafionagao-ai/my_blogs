/**
 * Global Layout Engine for Fiona Gao's Notion Blogs
 * 具备智能嗅探功能，仅对 Notion 导出的文章生效，不污染 post+md 文章。
 */
(function() {
    // 1. 🔍 智能嗅探：检查是否为 Notion 导出的文章结构
    const notionArticle = document.querySelector('article.page.sans');
    if (!notionArticle) return; // 如果没找到 Notion 特有结构，脚本立即自杀，不影响 md 文章

    // 2. 🎨 注入全局样式 (包含 PC 目录、代码块、页头页尾等所有样式)
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-blog-meta { display: flex; flex-direction: column; gap: 0.65rem; padding: 0.5rem 0 1.25rem 0; margin: 0 0 2.5rem 0; border-bottom: 1px solid #e5e7eb; font-family: ui-sans-serif, system-ui, sans-serif; }
        .meta-row { display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem; }
        .meta-left { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; flex: 1; }
        .meta-right { display: flex; justify-content: flex-end; flex-shrink: 0; min-width: 80px; }
        .meta-text-link { text-decoration: none !important; color: #6b7280 !important; font-size: 0.85rem; font-weight: 500; transition: color 0.2s; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .meta-text-link:hover { color: #3b82f6 !important; }
        .author-badge { display: inline-flex; align-items: center; gap: 0.25rem; color: #111827; font-weight: 600; cursor: pointer; background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8125rem; transition: background 0.2s; }
        .author-badge:hover { background: #eff6ff; color: #3b82f6; }
        .custom-blog-footer { margin-top: 3.5rem; padding: 2rem 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.8125rem; font-family: ui-sans-serif, system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; }
        .footer-author-link { color: #3b82f6; text-decoration: none; font-weight: 500; }
        .legal-row { font-size: 0.75rem; color: #9ca3af; margin: 0; line-height: 1.6; max-width: 100%; }
        .code-wrapper { position: relative; margin: 1.5rem 0; border-radius: 8px; background: #1e1e1e; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden; }
        pre.code { background: transparent !important; border-radius: 0 !important; padding: 2.5rem 1rem 1.2rem !important; margin: 0 !important; overflow-x: auto !important; position: static !important; }
        .copy-code-btn { position: absolute; top: 12px; right: 12px; background: transparent; color: #6b7280; border: none; cursor: pointer; z-index: 10; }
        .code-lang-label { position: absolute; top: 10px; left: 12px; font-size: 11px; color: #9ca3af; text-transform: uppercase; pointer-events: none; }
        .toc-wrapper { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 50; width: 36px; transition: width 0.3s ease; }
        .toc-wrapper::after { content: ''; position: absolute; top: -40px; bottom: -40px; left: -60px; right: -20px; z-index: -1; }
        .toc-wrapper:hover { width: 280px; }
        .toc-content { background: transparent; width: 100%; max-height: 60vh; overflow-y: auto; transition: all 0.3s; padding: 0.5rem 0; }
        .toc-wrapper:hover .toc-content { background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 1.25rem; }
        .toc-list { list-style: none; padding: 0; margin: 0; border: none !important; }
        .toc-wrapper:not(:hover) .toc-link { display: block; width: 16px; height: 4px; background-color: #e5e7eb; border-radius: 2px; color: transparent !important; font-size: 0; margin-bottom: 8px; transition: all 0.2s; }
        .toc-wrapper:not(:hover) .is-active-link { background-color: #55b685 !important; width: 24px !important; }
        .toc-wrapper:hover .toc-link { display: block; padding: 0.4rem 0.5rem; color: #4b5563; text-decoration: none; font-size: 0.875rem; white-space: normal; line-height: 1.5; border-radius: 6px; }
        .toc-wrapper:hover .is-active-link { color: #111827; font-weight: 600; background: #f9fafb; }
        @media (max-width: 1280px) { .toc-wrapper { display: none !important; } }
    `;
    document.head.appendChild(style);

    // 3. 🚀 获取页面数据（兼容新老版本）
    let meta = window.PAGE_META || {};
    
    // 如果是老版本，尝试从已有 DOM 中提取（并静默删除旧结构）
    if (!window.PAGE_META) {
        const oldMeta = document.querySelector('.custom-blog-meta');
        if (oldMeta) {
            meta.tags = oldMeta.querySelector('.meta-tags-value')?.innerHTML || '';
            meta.cTime = oldMeta.querySelector('.meta-ctime-value')?.textContent || '';
            meta.uTime = oldMeta.querySelector('.meta-utime-value')?.textContent || '';
            meta.isEn = window.location.href.includes('/en/');
            oldMeta.remove();
        }
        document.querySelector('.custom-blog-footer')?.remove();
        document.querySelector('.toc-wrapper')?.remove();
    }

    const isEn = meta.isEn;

    // 4. 🏗️ 构建新页头 (Meta Section)
    const metaHtml = `
        <div class="meta-row">
            <div class="meta-left">
                ${meta.tags ? `<div style="display:flex;align-items:center;gap:0.35rem;"><svg style="width:14px;height:14px;opacity:0.6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg><span style="font-weight:600;color:#4b5563;font-size:0.8125rem;">${isEn?'Tags':'标签'}:</span><div class="meta-tags-value" style="display:flex;gap:0.3rem;">${meta.tags}</div></div>` : ''}
                <div class="author-badge" onclick="copyAuthorEmail(this)" title="koala.fiona.gao@gmail.com"><svg style="width:14px;height:14px;opacity:0.8;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg><span class="author-text">Fiona Gao</span></div>
            </div>
            <div class="meta-right">
                <a href="https://koalafionagao-ai.github.io/my_blogs/" target="_blank" class="meta-text-link">
                    <svg style="width:15px;height:15px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> ${isEn?'Home':'首页'}
                </a>
            </div>
        </div>
        <div class="meta-row" style="color: #6b7280; font-size: 0.8125rem;">
            <div class="meta-left">
                ${meta.cTime ? `<span><span style="font-weight:600;">${isEn?'Created':'创建时间'}:</span> ${meta.cTime}</span>` : ''}
                ${meta.uTime ? `<span><span style="font-weight:600;">${isEn?'Updated':'更新时间'}:</span> ${meta.uTime}</span>` : ''}
            </div>
            <div class="meta-right"><span class="meta-text-link" onclick="togglePageLanguage()">切换语言</span></div>
        </div>`;
    
    const metaContainer = document.createElement('div');
    metaContainer.className = 'custom-blog-meta';
    metaContainer.innerHTML = metaHtml;
    const h1 = document.querySelector('h1.page-title') || document.querySelector('h1');
    if (h1) h1.after(metaContainer);

    // 5. 🧱 构建新页脚 (Footer)
    const footer = document.createElement('footer');
    footer.className = 'custom-blog-footer';
    footer.innerHTML = `
        <div class="copyright-row">© 2026 <a href="mailto:koala.fiona.gao@gmail.com" class="footer-author-link">Fiona Gao</a>. ${isEn ? 'All Rights Reserved.' : '原创文章，保留所有权利。'}</div>
        <div class="legal-row"><strong>${isEn ? 'LEGAL DISCLAIMER:' : '法律声明：'}</strong> ${isEn ? 'All content is original. Unauthorized reproduction prohibited.' : '本文为原创内容。未经书面许可，严禁任何形式的未经授权转载。'}</div>`;
    (document.querySelector('.page-body') || document.body).appendChild(footer);

    // 6. 🧭 注入 TOC 容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-wrapper';
    tocContainer.innerHTML = `<div class="toc-content"><div class="js-toc"></div></div>`;
    document.body.appendChild(tocContainer);

    // 7. 🔌 逻辑绑定与初始化 (复制、CDN、TOC)
    window.copyAuthorEmail = function(btn) { 
        navigator.clipboard.writeText("koala.fiona.gao@gmail.com").then(() => {
            const text = btn.querySelector('.author-text'); const old = text.textContent;
            text.textContent = isEn ? 'Copied!' : '已复制!';
            setTimeout(() => text.textContent = old, 2000);
        });
    };

    window.togglePageLanguage = function() {
        let url = window.location.href;
        window.location.href = url.includes('/en/') ? url.replace('/en/', '/zh/') : url.replace('/zh/', '/en/');
    };

    // 这里的脚本会处理代码块、CDN 等逻辑，建议在此处引入 Tocbot 和 Prism
})();