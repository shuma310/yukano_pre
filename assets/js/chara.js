// キャラクター一覧用スクリプト (chara.html向け)
document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const viewerEl = document.getElementById('chara-viewer');
    if (!viewerEl) return; // ビューアが存在しないページでは実行しない

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

    const characters = [
        {
            id: 'kogarashi',
            faction: 'yuka-high',
            name: '木枯アユム',
            nameKana: 'Kogarashi Ayumu',
            line: '「…………（無口）」',
            bio: '普通の高校生で、特筆すべきことはない。が、201X年9月29日の午前4時44分に「あれ」を目撃してしまい、いくつかの家族に関する記憶を失い、狂人を自称するようになってしまった。',
            image: basePath + 'assets/images/characters/char_kogarashi.png',
            thumb: basePath + 'assets/images/characters/char_kogarashi.png'
        },
        {
            id: 'nekobo',
            faction: 'yuka-high',
            name: '猫々目ぐみ',
            nameKana: 'Meumeume Gumi',
            line: '「大丈夫、猫飼ってるからね」',
            bio: 'ねこみみキャスケットがトレードマークの女の子。「南向きの窓」が開いていて、それ以外の全てが封鎖されて通過できない部屋の中でしか喋れない。',
            image: basePath + 'assets/images/characters/char_nekobo.png',
            thumb: basePath + 'assets/images/characters/char_nekobo.png'
        },
        {
            id: 'marusaka',
            faction: 'yuka-high',
            name: '◎坂万事',
            nameKana: 'Marusaki Banji',
            line: '「これは運命なんだ。君は今すぐ職員室へ行って、白紙の入部届のど真ん中に『◎◎部』と書くことになる。そうだろ？」',
            bio: '逆世界を探索する『◎◎部』の部長。性別不詳で、一人称は「吾輩」。「坂」について研究し、逆世界へ行く方法を確立しようとしている。',
            image: basePath + 'assets/images/characters/noimage.png',
            thumb: basePath + 'assets/images/characters/noimage.png'
        },
        {
            id: 'tadano',
            faction: 'yuka-high',
            name: '只野 正義',
            nameKana: 'Tadano Masayoshi',
            line: '「ホームルームをはじめまァ～～～す！！！（クソデカ大声）」',
            bio: '爽やかで熱血な体育教諭・生活指導。よく走り、よく笑い、よく食べる。\nが、過去になにかあったらしく、『修学旅行』という行事に特別思うところがあるらしい。',
            image: basePath + 'assets/images/characters/noimage.png',
            thumb: basePath + 'assets/images/characters/noimage.png'
        },
        {
            id: 'tsurimura',
            faction: 'yuka-high',
            name: '吊村 炉辺',
            nameKana: 'Tsurimura Rohen',
            line: '「好きなもの……海かな」',
            bio: '由嘉野高校の生物教諭。穏やかで理知的、知的好奇心に富む。\nなぜか毎晩、西由嘉野の海に毎夜通いつめている。',
            image: basePath + 'assets/images/characters/noimage.png',
            thumb: basePath + 'assets/images/characters/noimage.png'
        }
    ];

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

            btn.innerHTML = `
                <img src="${char.thumb}" alt="${char.name}">
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
        mainLineEl.innerText = currentChar.line;
        mainNameEl.innerText = currentChar.name;
        mainNameKanaEl.innerText = currentChar.nameKana;
        mainBioEl.innerText = currentChar.bio;

        if (mainLinkEl) {
            mainLinkEl.href = `contents/char_${currentChar.id}.html`;
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
