document.getElementById('generate').addEventListener('click', () => {
    const selectedWaifu = document.querySelector('input[name="waifu"]:checked');
    const nsfwCheckbox = document.getElementById('nsfw-checkbox');
    let query = '';

    if (selectedWaifu) {
        switch (selectedWaifu.value) {
            case 'kalisa':
                query = 'kalisa the battle cats';
                break;
            case 'terun':
                query = 'terun the battle cats';
                break;
            case 'tomoe_mami':
                query = 'tomoe mami';
                break;
            default:
                query = 'kalisa the battle cats';
        }

        if (nsfwCheckbox.checked) {
            query += ' rule 34';
        }
    }

    fetchRandomImage(query);
});

async function fetchRandomImage(query) {
    const apiKey = 'AIzaSyBFKLx3R26bIQhrbsHbf08LoKy1tJIDHak';
    const cx = '13776594ebbda431d';
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&cx=${cx}&key=${apiKey}`;

    const loadingElement = document.getElementById('loading');
    const progressBar = document.querySelector('.progress');
    const imageContainer = document.getElementById('image-container');
    const imageElement = document.getElementById('image');

    let interval;
    try {
        loadingElement.style.display = 'flex';
        imageContainer.style.display = 'none';

        let progress = 0;
        interval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 300);

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items) {
            throw new Error('No images found');
        }

        const images = data.items.map(item => item.link);
        const randomImage = images[Math.floor(Math.random() * images.length)];

        imageElement.src = randomImage;
        imageElement.onload = () => {
            clearInterval(interval);
            loadingElement.style.display = 'none';
            progressBar.style.width = '0';
            imageContainer.style.display = 'block';
        };
    } catch (error) {
        console.error('Ошибка в поиске вайфу:', error);
        clearInterval(interval);
        loadingElement.innerHTML = 'Ошибка при загрузке изображения. Попробуйте снова.';
    }
}

document.getElementById('toggle-waifu-list').addEventListener('click', function() {
    var waifuList = document.getElementById('waifu-list');
    if (waifuList.style.maxHeight === '0px' || waifuList.style.maxHeight === '') {
        waifuList.style.maxHeight = waifuList.scrollHeight + 'px';
    } else {
        waifuList.style.maxHeight = '0px';
    }
});

document.querySelectorAll('.waifu-option').forEach(option => {
    option.addEventListener('click', function() {
        const input = option.querySelector('input');
        input.checked = true;
        input.dispatchEvent(new Event('change'));
    });
});

document.querySelectorAll('.waifu-option input').forEach(input => {
    input.addEventListener('change', function() {
        const selectedWaifu = document.querySelector('input[name="waifu"]:checked');
        const waifuImg = selectedWaifu.nextElementSibling.src;
        const waifuName = selectedWaifu.nextElementSibling.nextElementSibling.textContent;

        document.getElementById('selected-waifu-img').src = waifuImg;
        document.getElementById('selected-waifu-img').style.display = 'block';
        document.getElementById('selected-waifu-text').textContent = waifuName;

        const nsfwCheckbox = document.getElementById('nsfw-checkbox');
        const restrictedMessage = document.getElementById('restricted-message');
        if (selectedWaifu.value === 'tomoe_mami') {
            nsfwCheckbox.checked = false;
            nsfwCheckbox.disabled = true;
            restrictedMessage.style.display = 'inline';
        } else {
            nsfwCheckbox.disabled = false;
            restrictedMessage.style.display = 'none';
        }

        var waifuList = document.getElementById('waifu-list');
        waifuList.style.maxHeight = '0px';
    });
});

const firstWaifuOption = document.querySelector('.waifu-option input');
if (firstWaifuOption) {
    firstWaifuOption.checked = true;
    firstWaifuOption.dispatchEvent(new Event('change'));
}