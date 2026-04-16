document.addEventListener('DOMContentLoaded', () => {
    const characterId = document.body.dataset.characterId;
    if (!characterId || typeof window.getYukanoCharacterById !== 'function') return;

    const character = window.getYukanoCharacterById(characterId);
    if (!character) return;

    const basePath = document.querySelector('meta[name="base-path"]')?.content || '../../';

    function withBasePath(path) {
        return path ? basePath + path : '';
    }

    function renderTextLines(lines) {
        return lines
            .map(line => line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;'))
            .join('<br>');
    }

    document.title = `${character.name} | キャラクター紹介 | ゆかの高校◎◎部！！`;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', `${character.name}のキャラクター紹介。ゆかの高校◎◎部！！`);
    }

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', `${character.name} | ゆかの高校◎◎部！！`);
    }

    const breadcrumbNameEl = document.getElementById('character-breadcrumb-name');
    if (breadcrumbNameEl) {
        breadcrumbNameEl.textContent = character.name;
    }

    const nameEl = document.getElementById('character-name');
    if (nameEl) {
        nameEl.textContent = character.name;
    }

    const nameKanaEl = document.getElementById('character-name-kana');
    if (nameKanaEl) {
        nameKanaEl.textContent = character.nameKana;
    }

    const tagsEl = document.getElementById('character-tags');
    if (tagsEl) {
        tagsEl.innerHTML = character.tags
            .map(tag => `<span class="brutal-tag">${tag}</span>`)
            .join('');
    }

    const infoTitleEl = document.getElementById('character-info-title');
    if (infoTitleEl) {
        infoTitleEl.textContent = character.infoTitle;
    }

    const infoBodyEl = document.getElementById('character-info-body');
    if (infoBodyEl) {
        infoBodyEl.innerHTML = renderTextLines(character.infoBody);
    }

    const profileBodyEl = document.getElementById('character-profile-body');
    if (profileBodyEl) {
        profileBodyEl.innerHTML = `
            ${renderTextLines(character.profile)}
            <br><br>
            <span style="color:var(--color-gray-500);">台詞：</span><br>
            <em style="color:var(--color-blue); font-style:normal;">${renderTextLines(character.quotes)}</em>
        `;
    }

    const imageWrapEl = document.getElementById('character-image-wrap');
    if (imageWrapEl) {
        if (character.detailImage) {
            imageWrapEl.innerHTML = `
                <img src="${withBasePath(character.detailImage)}" alt="${character.name}">
                <div id="character-type-badge" class="char-type-badge" aria-label="キャラクタータイプ：${character.typeLabel}">${character.typeLabel}</div>
            `;
        } else {
            imageWrapEl.innerHTML = `
                <span class="char-no-image" aria-hidden="true">NO<br>IMAGE</span>
                <div id="character-type-badge" class="char-type-badge" aria-label="キャラクタータイプ：${character.typeLabel}">${character.typeLabel}</div>
            `;
        }
    }
});
