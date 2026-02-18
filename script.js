const imageElement = document.getElementById("background");
const audioElement = document.getElementById("ambience");
const audioToggle = document.getElementById("audio-toggle");
const slideCounter = document.getElementById("slide-counter");
const phraseElement = document.getElementById("phrase");
const translationElement = document.getElementById("translation");
const languageCard = document.querySelector(".language-card");

const totalImages = 50;
const slideIntervalMs = 8000;
const fadeOutMs = 1500;

const imagePaths = Array.from(
    { length: totalImages },
    (_, index) => `images/jungle_beast_${index + 1}.png`
);

const soundPaths = [
    "sounds/jungle_sound_1.wav",
    "sounds/jungle_sound_2.wav",
    "sounds/jungle_sound_3.wav",
    "sounds/jungle_sound_4.wav"
];

const phrases = [
    { jungle: "Chorra-tok Ssaa-vrek", translation: "The silent watcher of the canopy." },
    { jungle: "Vrumka-lei Zaa-thor", translation: "It sings before the rain begins." },
    { jungle: "Mekkari-lo Sun-veth", translation: "Guardian of the glowing moss." },
    { jungle: "Taal-ssori Vek-na", translation: "Born from thunder and shadow." },
    { jungle: "Zorri-mah Tekkalu", translation: "It moves only when unseen." },
    { jungle: "Ruun-vek Chalossa", translation: "Whispers travel through its fur." },
    { jungle: "Vassa-nor Jekkari", translation: "The jungle bends in its presence." },
    { jungle: "Tolma-rii Shakka", translation: "Eyes brighter than fallen stars." },
    { jungle: "Vrenna-kol Ma-seth", translation: "Its roar splits the night." },
    { jungle: "Krovali Zen-tha", translation: "Born from roots and ancient rain." },
    { jungle: "Lumari Voss-ket", translation: "It remembers forgotten rivers." },
    { jungle: "Shaari-tok Mekketh", translation: "A spirit wrapped in fur." },
    { jungle: "Vekka-sun Tol-rath", translation: "It hunts only in dreams." },
    { jungle: "Xelari Vroom-ta", translation: "The air trembles at its call." },
    { jungle: "Chessa-lo Varneth", translation: "Hidden between leaves and light." },
    { jungle: "Norr-ka Sil-veth", translation: "Ancient heartbeat of the jungle." }
];

let currentImageIndex = 0;
let slideshowTimer;
let audioEnabled = true;

function formatCounter(index) {
    const current = String(index + 1).padStart(2, "0");
    const total = String(totalImages).padStart(2, "0");
    return `${current} / ${total}`;
}

function updateAudioButton() {
    audioToggle.textContent = audioEnabled ? "sound: on" : "sound: off";
}

function updateCounter() {
    slideCounter.textContent = formatCounter(currentImageIndex);
}

function updateLanguage() {
    const phraseIndex = currentImageIndex % phrases.length;

    languageCard.classList.remove("is-refreshing");
    void languageCard.offsetWidth;
    languageCard.classList.add("is-refreshing");

    phraseElement.textContent = phrases[phraseIndex].jungle;
    translationElement.textContent = phrases[phraseIndex].translation;
}

async function tryPlayAudio() {
    if (!audioEnabled) {
        return;
    }

    try {
        await audioElement.play();
    } catch (_) {
        audioToggle.textContent = "tap for sound";
    }
}

function setAudioForCurrentImage() {
    const nextTrack = soundPaths[currentImageIndex % soundPaths.length];
    const shouldSwapTrack = audioElement.src !== new URL(nextTrack, window.location.href).href;

    if (shouldSwapTrack) {
        audioElement.src = nextTrack;
    }

    audioElement.loop = true;
    audioElement.volume = 0.9;

    tryPlayAudio();
}

function showImage(index) {
    const preloadImage = new Image();
    preloadImage.src = imagePaths[index];

    preloadImage.onload = () => {
        if (!imageElement.src) {
            imageElement.src = preloadImage.src;
            imageElement.classList.add("is-visible");
            return;
        }

        imageElement.classList.remove("is-visible");

        setTimeout(() => {
            imageElement.src = preloadImage.src;
            imageElement.classList.add("is-visible");
        }, fadeOutMs);
    };
}

function nextSlide() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    showImage(currentImageIndex);
    setAudioForCurrentImage();
    updateLanguage();
    updateCounter();
}

function initSlideshow() {
    showImage(currentImageIndex);
    setAudioForCurrentImage();
    updateLanguage();
    updateCounter();

    slideshowTimer = setInterval(nextSlide, slideIntervalMs);
}

audioToggle.addEventListener("click", async () => {
    audioEnabled = !audioEnabled;

    if (audioEnabled) {
        setAudioForCurrentImage();
    } else {
        audioElement.pause();
    }

    updateAudioButton();
});

["click", "touchstart", "keydown"].forEach((eventName) => {
    window.addEventListener(
        eventName,
        () => {
            if (audioEnabled && audioElement.paused) {
                tryPlayAudio();
            }
        }
    );
});

window.addEventListener("blur", () => {
    clearInterval(slideshowTimer);
});

window.addEventListener("focus", () => {
    clearInterval(slideshowTimer);
    slideshowTimer = setInterval(nextSlide, slideIntervalMs);
});

updateAudioButton();
initSlideshow();
