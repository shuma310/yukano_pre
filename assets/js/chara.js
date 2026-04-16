// キャラクター一覧用スクリプト (chara.html向け)
document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const viewerEl = document.getElementById('chara-viewer');
    if (!viewerEl) return; // ビューアが存在しないページでは実行しない
    if (!Array.isArray(window.YUKANO_CHARACTERS)) return;

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    const factionMenuEl = document.getElementById('chara-faction-menu');
    const charListEl = document.getElementById('chara-list');

    const mainImageEl = document.getElementById('chara-main-image');
    const mainLineEl = document.getElementById('chara-main-line');
    const mainNameEl = document.getElementById('chara-main-name');
    const mainNameKanaEl = document.getElementById('chara-main-kana');
    const mainFactionBadgeEl = document.getElementById('chara-main-faction-badge');
    const mainBioEl = document.getElementById('chara-main-bio');
    const mainLinkEl = document.getElementById('chara-main-link');
    const infoLayerEl = document.getElementById('chara-info-layer');

    // 派閥データ
    const factions = [
        { id: 'yuka-high', label: '由嘉野高校', color: 'var(--color-lime)' }
    ];

    // キャラクターデータ
    const basePath = document.querySelector('meta[name="base-path"]')?.content || '../';
    const characters = window.YUKANO_CHARACTERS.map(character => ({
        id: character.id,
        faction: character.faction,
        name: character.name,
        nameKana: character.nameKana,
        line: character.line,
        bio: character.viewerBio,
        image: basePath + character.viewerImage,
        thumb: basePath + character.viewerImage
    }));

    let currentFaction = factions[0].id;
    let currentChar = characters.find(c => c.faction === currentFaction);

    function renderFactions() {
        factionMenuEl.innerHTML = '';
        factions.forEach(faction => {
            const btn = document.createElement('button');
            const isActive = faction.id === currentFaction;

            btn.className = 'chara-tab-btn' + (isActive ? ' is-active' : '');
            btn.innerText = faction.label;

            btn.onclick = () => {
                if (currentFaction !== faction.id) {
                    currentFaction = faction.id;
                    currentChar = characters.find(c => c.faction === currentFaction);
                    renderFactions();
                    renderCharList();
                    updateMainView();
                }
            };
            factionMenuEl.appendChild(btn);
        });
    }

    function renderCharList() {
        charListEl.innerHTML = '';
        const filteredChars = characters.filter(c => c.faction === currentFaction);

        filteredChars.forEach(char => {
            const isActive = char.id === currentChar.id;
            const btn = document.createElement('button');

            btn.className = 'chara-thumb-btn' + (isActive ? ' is-active' : '');
            btn.type = 'button';
            btn.setAttribute('aria-label', `${char.name}を表示`);
            btn.setAttribute('aria-pressed', String(isActive));

            btn.innerHTML = `
                <img src="${char.thumb}" alt="">
                ${isActive ? '<div class="chara-thumb-active-icon">★</div>' : ''}
            `;

            btn.onclick = () => {
                if (currentChar.id !== char.id) {
                    currentChar = char;
                    renderCharList();
                    updateMainView();
                }
            };
            charListEl.appendChild(btn);
        });
    }

    function updateMainView() {
        if (!currentChar) return;

        const factionInfo = factions.find(f => f.id === currentChar.faction);

        // クラス切り替えによる背景色変更
        viewerEl.classList.remove('is-faction-citizen', 'is-faction-ura-yukano', 'is-faction-yuka-high');
        viewerEl.classList.add(`is-faction-${factionInfo.id}`);

        // アニメーションのリセット
        infoLayerEl.classList.remove('animate-slide-in-left');
        mainImageEl.classList.remove('animate-pop-in');
        // リフロー強制（アニメーション再実行のため）
        void infoLayerEl.offsetWidth;

        // データ反映
        mainImageEl.src = currentChar.image;
        mainImageEl.alt = currentChar.name;
        mainLineEl.innerText = currentChar.line;
        mainNameEl.innerText = currentChar.name;
        mainNameKanaEl.innerText = currentChar.nameKana;
        mainBioEl.innerHTML = escapeHtml(currentChar.bio).replace(/\n/g, '<br>');

        if (mainLinkEl) {
            mainLinkEl.href = `contents/char_${currentChar.id}.html`;
            mainLinkEl.setAttribute('aria-label', `${currentChar.name}の詳細を見る`);
        }

        // バッジ更新
        mainFactionBadgeEl.innerText = factionInfo.label;
        mainFactionBadgeEl.className = `brutal-tag brutal-tag--${factionInfo.id === 'ura-yukano' ? 'blue' : (factionInfo.id === 'citizen' ? 'yellow' : 'lime')}`;

        // アニメーション適用
        infoLayerEl.classList.add('animate-slide-in-left');
        mainImageEl.classList.add('animate-pop-in');
    }

    // 初期描画
    renderFactions();
    renderCharList();
    updateMainView();
});
