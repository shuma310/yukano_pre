

document.addEventListener("DOMContentLoaded", () => {
    const basePath = document.querySelector('meta[name="base-path"]')?.content || "./";

    function normalizePath(pathname) {
        const normalized = pathname
            .replace(/\\/g, '/')
            .replace(/index\.html$/i, '')
            .replace(/\/+$/g, '');

        return normalized || '/';
    }

    function updateActiveNav() {
        const currentPath = normalizePath(window.location.pathname);
        const links = document.querySelectorAll('.global-nav-pc__list a, .global-nav-sp__list a');

        links.forEach(link => {
            const linkPath = normalizePath(new URL(link.getAttribute('href'), window.location.href).pathname);
            const isActive = linkPath === currentPath;

            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function setMobileNavState(isOpen) {
        const btn = document.getElementById("js-hamburger");
        const nav = document.getElementById("js-nav-sp");

        if (btn) {
            btn.classList.toggle("is-active", isOpen);
            btn.setAttribute("aria-expanded", String(isOpen));
            btn.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
        }

        if (nav) {
            nav.classList.toggle("is-open", isOpen);
            nav.setAttribute("aria-hidden", String(!isOpen));
        }
    }

    function enhanceHeader() {
        updateActiveNav();
        setMobileNavState(false);
    }

    function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // 現在のパスからの相対パス解決を補助
        const url = basePath + componentPath;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.text();
            })
            .then(html => {
                // テンプレート変数の置換
                html = html.replace(/\{\{basePath\}\}/g, basePath);
                element.innerHTML = html;

                if (elementId === 'common-header') {
                    enhanceHeader();
                }
            })
            .catch(error => {
                console.warn(`[Vanilla JS] コンポーネント(${componentPath})の読み込みに失敗しました。ローカルプレビュー時などプロトコルエラーの可能性があります。:`, error);

                // フォールバック表示（ローカルプレビュー用）
                if (elementId === 'common-footer') {
                    element.innerHTML = `
<footer class="site-footer">
    <div class="site-footer__inner">
        <p class="site-footer__title"><a href="${basePath}index.html">ゆかの高校◎◎部！！</a></p>
        <p class="site-footer__copy">&copy; 2026 金魚大明神. All rights reserved.</p>
    </div>
</footer>`;
                } else if (elementId === 'common-header') {
                    element.innerHTML = `
<a href="#main-content" class="skip-link">本文へスキップ</a>
<header class="global-header">
    <div class="global-header__inner">
        <a href="${basePath}index.html" class="global-header__logo">
            ゆかの高校◎◎部！！
        </a>

        <nav class="global-nav-pc" aria-label="グローバルナビゲーション">
            <ul class="global-nav-pc__list">
                <li><a href="${basePath}index.html">Top</a></li>
                <li><a href="${basePath}world/index.html">World</a></li>
                <li><a href="${basePath}chara/index.html">Character</a></li>
                <li><a href="${basePath}novel/index.html">Story</a></li>
            </ul>
        </nav>

        <button id="js-hamburger" class="hamburger-btn" aria-label="メニューを開く" aria-controls="js-nav-sp" aria-expanded="false" type="button">
            <span class="line-1"></span>
            <span class="line-2"></span>
            <span class="line-3"></span>
        </button>
    </div>
</header>

<nav id="js-nav-sp" class="global-nav-sp" aria-label="モバイルナビゲーション" aria-hidden="true">
    <ul class="global-nav-sp__list">
        <li>
            <a href="${basePath}index.html" class="nav-sp-link nav-top">Top</a>
        </li>
        <li>
            <a href="${basePath}world/index.html" class="nav-sp-link nav-world">World</a>
        </li>
        <li>
            <a href="${basePath}chara/index.html" class="nav-sp-link nav-chara">Character</a>
        </li>
        <li>
            <a href="${basePath}novel/index.html" class="nav-sp-link nav-story">Story</a>
        </li>
    </ul>
</nav>`;
                    enhanceHeader();
                }
            });
    }

    loadComponent('common-header', 'components/header.html');
    loadComponent('common-footer', 'components/footer.html');

    // グローバルヘッダーのハンバーガーメニュー開閉（イベントデリゲーション）
    document.addEventListener("click", e => {
        const btn = e.target.closest("#js-hamburger");
        if (btn) {
            setMobileNavState(btn.getAttribute("aria-expanded") !== "true");
            return;
        }

        const mobileLink = e.target.closest("#js-nav-sp a");
        if (mobileLink) {
            setMobileNavState(false);
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            setMobileNavState(false);
        }
    });

    // Markdownの共通処理・カクヨム記法の拡張（傍点・ルビ）
    const mdSourceEl = document.getElementById("markdown-source");
    if (mdSourceEl) {
        const mdTargetEl = document.getElementById("content-target");
        if (mdTargetEl) {
            const script = document.createElement('script');
            script.src = basePath + "assets/vendor/marked.umd.js";
            script.onload = () => {
                let mdSource = mdSourceEl.textContent.replace(/^\n+|\n+$/g, '');

                // カクヨム記法 傍点: 《《文字》》
                mdSource = mdSource.replace(/《《(.+?)》》/g, '<em style="text-emphasis: filled dot; -webkit-text-emphasis: filled dot; font-style: normal;">$1</em>');

                // カクヨム記法 ルビ（パイプ区切り）: |文字《ルビ》
                mdSource = mdSource.replace(/\|([^《\n]+)《([^》\n]+)》/g, '<ruby>$1<rt>$2</rt></ruby>');

                // カクヨム記法 ルビ（漢字自動）: 漢字《ルビ》
                mdSource = mdSource.replace(/([一-龠々]+)《([^》\n]+)》/g, '<ruby>$1<rt>$2</rt></ruby>');

                // TBC (To Be Continued) 置換
                mdSource = mdSource.replace(/^\s*\[TBC\]\s*$/gm, '<p class="text-center mt-20 font-display text-yukano-pink" style="font-size:1.5rem;">To Be Continued...</p>');
                mdSource = mdSource.replace(/^\s*\[TBC:(.+?)\]\s*$/gm, '<p class="text-center mt-20 font-display text-yukano-pink" style="font-size:1.5rem;">$1</p>');

                // Markdownの連続する空行をそのまま空白行として出力するための処理
                // \n\n (1行空き) の場合は <br> が1つ、\n\n\n の場合は <br> が2つ出力されるようにする
                mdSource = mdSource.replace(/\n(\n+)/g, function (match, p1) {
                    return '\n\n' + '<br>'.repeat(p1.length) + '\n\n';
                });

                const renderer = new marked.Renderer();
                renderer.hr = function () {
                    return '<div style="display:flex;justify-content:center;gap:0.5rem;margin:3rem 0;" aria-hidden="true">'
                        + '<div style="width:0.75rem;height:0.75rem;background:var(--color-dark);transform:rotate(45deg);"></div>'
                        + '<div style="width:0.75rem;height:0.75rem;background:var(--color-pink);transform:rotate(45deg);"></div>'
                        + '<div style="width:0.75rem;height:0.75rem;background:var(--color-dark);transform:rotate(45deg);"></div>'
                        + '</div>';
                };
                marked.setOptions({ renderer: renderer, breaks: true, gfm: true });
                mdTargetEl.innerHTML = marked.parse(mdSource);
            };
            document.head.appendChild(script);
        }
    }

});
