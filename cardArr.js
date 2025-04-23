const cardArr = [...Array(52)].map((_, i) => `card${i + 1}.webp`);
const cardCache = [];

// Preload all card images
cardArr.forEach(src => {
    const img = new Image();
    img.src = src;
    cardCache.push(img);
});

export function pickRandomCard() {
    const randomIndex = Math.floor(Math.random() * cardCache.length);
    return cardCache[randomIndex].src;
}