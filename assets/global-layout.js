/**
 * Global Layout Engine for Fiona Gao's Notion Blogs
 * 具备智能嗅探功能，仅对 Notion 导出的文章生效，不污染 post+md 文章。
 */
(function() {
    // 1. 🔍 智能嗅探：检查是否为 Notion 导出的文章结构
    const notionArticle = document.querySelector('article.page.sans');
    if (!notionArticle) return; // 如果没找到，脚本自杀，不影响 md 文章

    // 2. 🎨 注入全局样式 (完美保留原先所有 CSS 设置)
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-blog-meta { display: flex; flex-direction: column; gap: 0.65rem; padding: 0.5rem 0 1.25rem 0; margin: 0 0 2.5rem 0; border-bottom: 1px solid #e5e7eb; font-family: ui-sans-serif, system-ui, sans-serif; }
        .meta-row { display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem; }
        .meta-left { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; flex: 1; }
        .meta-right { display: flex; justify-content: flex-end; flex-shrink: 0; min-width: 80px; }
        .meta-text-link { text-decoration: none !important; color: #6b7280 !important; font-size: 0.85rem; font-weight: 500; transition: color 0.2s; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; }
        .meta-text-link:hover { color: #3b82f6 !important; }
        .author-badge { display: inline-flex; align-items: center; gap: 0.25rem; color: #111827; font-weight: 600; cursor: pointer; background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8125rem; transition: background 0.2s; }
        .author-badge:hover { background: #eff6ff; color: #3b82f6; }
        .custom-blog-footer { margin-top: 3.5rem; padding: 2rem 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.8125rem; font-family: ui-sans-serif, system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; }
        .footer-author-link { color: #3b82f6; text-decoration: none; font-weight: 500; }
        .legal-row { font-size: 0.75rem; color: #9ca3af; margin: 0; line-height: 1.6; max-width: 100%; }
        .code-wrapper { position: relative; margin: 1.5rem 0; border-radius: 8px; background: #1e1e1e; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden; }
        pre.code { background: transparent !important; border-radius: 0 !important; padding: 2.5rem 1rem 1.2rem !important; margin: 0 !important; overflow-x: auto !important; position: static !important; }
        .copy-code-btn { position: absolute; top: 12px; right: 12px; background: transparent; color: #6b7280; border: none; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; }
        .copy-code-btn:hover { color: #d1d5db; background: transparent; }
        .code-lang-label { position: absolute; top: 10px; left: 12px; font-size: 11px; color: #9ca3af; text-transform: uppercase; pointer-events: none; text-shadow: none !important; }
        .toc-wrapper { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 50; width: 36px; transition: width 0.3s ease; }
        .toc-wrapper::after { content: ''; position: absolute; top: -40px; bottom: -40px; left: -60px; right: -20px; z-index: -1; }
        .toc-wrapper:hover { width: 280px; }
        .toc-content { background: transparent; width: 100%; max-height: 60vh; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid transparent; padding: 0.5rem 0; position: relative; z-index: 1; }
        .toc-content::-webkit-scrollbar { display: none; }
        .toc-wrapper:hover .toc-content { background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border-color: #f3f4f6; padding: 1.25rem; max-height: calc(100vh - 120px); }
        .toc-wrapper:hover .toc-content::-webkit-scrollbar { display: block; width: 4px; }
        .toc-wrapper:hover .toc-content::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .toc-list { list-style: none; padding: 0; margin: 0; border: none !important; }
        .toc-list .toc-list { border: none !important; padding-left: 0; }
        .toc-wrapper:not(:hover) .toc-list-item { display: flex; justify-content: flex-end; margin-bottom: 8px; border: none !important; }
        .toc-wrapper:not(:hover) .toc-link { display: block; width: 16px; height: 4px; background-color: #e5e7eb; border-radius: 2px; color: transparent !important; font-size: 0; padding: 0; margin: 0; transition: all 0.2s ease; overflow: hidden; white-space: nowrap; user-select: none; border: none !important; }
        .toc-wrapper:not(:hover) .toc-list .toc-list { margin-top: 8px; width: 100%; padding-left: 0; }
        .toc-wrapper:not(:hover) .toc-list .toc-list .toc-link { width: 10px; }
        .toc-wrapper:not(:hover) .is-active-link { background-color: #55b685 !important; width: 24px !important; }
        .toc-wrapper:not(:hover) .toc-link::before { display: none !important; }
        .toc-wrapper:hover .toc-list-item { margin-bottom: 0; display: block; text-align: left; }
        .toc-wrapper:hover .toc-list .toc-list { padding-left: 1rem; margin-top: 0.2rem; }
        .toc-wrapper:hover .toc-link { display: block; width: auto; height: auto; background-color: transparent; color: #4b5563; margin: 0; padding: 0.4rem 0.5rem; border-radius: 6px; font-size: 0.875rem; white-space: normal; word-break: break-word; line-height: 1.5; transition: all 0.2s; }
        .toc-wrapper:hover .toc-link:hover { background: #f3f4f6; color: #111827; }
        .toc-wrapper:hover .is-active-link { color: #111827; font-weight: 600; background: #f9fafb; position: relative; }
        .toc-wrapper:hover .is-active-link::before { content: ''; position: absolute; left: 0; top: 15%; bottom: 15%; width: 3px; border-radius: 2px; background: #55b685; }
        .is-collapsible { max-height: none !important; overflow: visible !important; }
        .is-collapsed { max-height: none !important; }
        @media (max-width: 1280px) { .toc-wrapper { display: none !important; } }
        @media (max-width: 640px) { .meta-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; } .meta-right { width: 100%; justify-content: flex-start; margin-top: 0.25rem; } }
    `;
    document.head.appendChild(style);

    // 3. 🚀 获取页面数据（完美提取旧数据）
    let meta = window.PAGE_META || {};
    
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

    // 4. 💡 完美复原的精准原生 SVG Icon 库
    const translateIcon = `<svg style="width:14px;height:14px;opacity:0.7;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`;
    const homeIcon = `<svg style="width:15px;height:15px;opacity:0.8;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    const tagIcon = `<svg style="width:14px;height:14px;opacity:0.6;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>`;
    const mailIcon = `<svg style="width:14px;height:14px;opacity:0.8;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
    const calendarIcon = `<svg style="width:14px;height:14px;opacity:0.6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
    const clockIcon = `<svg style="width:14px;height:14px;opacity:0.6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    // 5. 🏗️ 构建带有隐藏状态语言切换按钮的 HTML 
    // 注意下面 id="lang-switch-btn" 默认加了 style="display:none;"
    const metaHtml = `
        <div class="meta-row">
            <div class="meta-left">
                ${meta.tags ? `<div style="display:flex;align-items:center;gap:0.35rem;">${tagIcon}<span style="font-weight:600;color:#4b5563;font-size:0.8125rem;">${isEn?'Tags':'标签'}:</span><div class="meta-tags-value" style="display:flex;gap:0.3rem;">${meta.tags}</div></div>` : ''}
                <div class="author-badge" onclick="copyAuthorEmail(this)" title="koala.fiona.gao@gmail.com">${mailIcon}<span class="author-text" style="margin-left:4px;">Fiona Gao</span></div>
            </div>
            <div class="meta-right">
                <a href="https://koalafionagao-ai.github.io/my_blogs/" target="_blank" class="meta-text-link" style="display:flex;align-items:center;gap:4px;">${homeIcon}${isEn?'Home':'首页'}</a>
            </div>
        </div>
        <div class="meta-row" style="color: #6b7280; font-size: 0.8125rem;">
            <div class="meta-left" style="gap: 1.25rem;">
                ${meta.cTime ? `<div style="display:flex;align-items:center;gap:0.35rem;">${calendarIcon}<span style="font-weight:600;color:#4b5563;">${isEn?'Created':'创建时间'}:</span> <span class="meta-ctime-value" style="color: #1f2937;">${meta.cTime}</span></div>` : ''}
                ${meta.uTime ? `<div style="display:flex;align-items:center;gap:0.35rem;">${clockIcon}<span style="font-weight:600;color:#4b5563;">${isEn?'Updated':'更新时间'}:</span> <span class="meta-utime-value" style="color: #1f2937;">${meta.uTime}</span></div>` : ''}
            </div>
            <div class="meta-right">
                <span class="meta-text-link" id="lang-switch-btn" style="display:none; align-items:center; gap:4px;" onclick="togglePageLanguage()">${translateIcon} ${isEn?'中文':'English'}</span>
            </div>
        </div>`;
    
    const metaContainer = document.createElement('div');
    metaContainer.className = 'custom-blog-meta';
    metaContainer.innerHTML = metaHtml;
    const h1 = document.querySelector('h1.page-title') || document.querySelector('h1');
    if (h1) h1.after(metaContainer);

    // 6. 🧱 复刻页脚
    const footer = document.createElement('footer');
    footer.className = 'custom-blog-footer';
    footer.innerHTML = `
        <div class="copyright-row">© 2026 <a href="mailto:koala.fiona.gao@gmail.com" class="footer-author-link">Fiona Gao</a>. ${isEn ? 'All Rights Reserved.' : '原创文章，保留所有权利。'}</div>
        <div class="legal-row"><strong>${isEn ? 'LEGAL DISCLAIMER:' : '法律声明：'}</strong> ${isEn ? 'All content is original. Unauthorized reproduction or commercial use is strictly prohibited.' : '本文为原创内容。未经书面许可，严禁任何形式的未经授权转载或商业使用。'}</div>`;
    (document.querySelector('.page-body') || document.body).appendChild(footer);

    // 7. 🧭 注入 TOC 容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-wrapper';
    tocContainer.innerHTML = `<div class="toc-content"><div class="js-toc"></div></div>`;
    document.body.appendChild(tocContainer);

    // 8. 🔌 交互逻辑绑定
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
    
    // 代码块增强逻辑
    document.querySelectorAll('pre.code').forEach(pre => {
        const code = pre.querySelector('code'); let lang = 'CODE'; if (code && code.className) { const m = code.className.match(/language-([a-zA-Z0-9]+)/); if (m) lang = m[1]; }
        if (!pre.parentElement.classList.contains('code-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const copyBtn = document.createElement('button'); copyBtn.className = 'copy-code-btn'; copyBtn.title = isEn ? 'Copy code' : '复制代码'; copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`; 
            copyBtn.setAttribute('onclick', 'if(window.copyCodeText) window.copyCodeText(this)'); 
            wrapper.appendChild(copyBtn);
            const label = document.createElement('div'); label.className = 'code-lang-label'; label.textContent = lang; wrapper.appendChild(label);
        }
    });
    
    window.copyCodeText = function(btn) { 
        const code = btn.parentElement.querySelector('code'); 
        navigator.clipboard.writeText(code.innerText).then(() => { 
            const originalHtml = btn.innerHTML; btn.innerHTML = "✅"; btn.style.background = "transparent"; btn.style.border = "none"; 
            setTimeout(() => { btn.innerHTML = originalHtml; btn.style.background = ""; btn.style.border = ""; }, 2000); 
        }); 
    };

    // 💡 [方案A增强版] 内容核验法动态试探双语版本是否存在
    const currentUrl = window.location.href;
    let targetUrl = '';
    
    if (currentUrl.includes('/en/')) {
        targetUrl = currentUrl.replace('/en/', '/zh/');
    } else if (currentUrl.includes('/zh/')) {
        targetUrl = currentUrl.replace('/zh/', '/en/');
    }

    // 只在正常线上环境且存在目标路径时试探
    if (targetUrl && !currentUrl.startsWith('file://')) {
        // 使用 GET 请求获取对方页面的源码
        fetch(targetUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network error or 404');
                return response.text();
            })
            .then(html => {
                // 核心修复：即使 GitHub 骗我们返回了 200，只要源码里没有咱们的专属标记，就不展示按钮
                if (html.includes('PAGE_META') || html.includes('page-body')) {
                    const langBtn = document.getElementById('lang-switch-btn');
                    if (langBtn) {
                        langBtn.style.display = 'flex'; // 校验成功，亮出按钮
                    }
                }
            })
            .catch(error => {
                // 彻底挂了，保持原本的 display:none
            });
    }

})();