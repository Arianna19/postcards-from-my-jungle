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
    { jungle: "Chorra-tok Ssaa-vrek", translation: "Move away. This is my log." },
    { jungle: "Vrumka-lei Zaa-thor", translation: "Stop staring at me." },
    { jungle: "Mekkari-lo Sun’veth", translation: "I found this first." },
    { jungle: "Taal-ssori Vek-na", translation: "That noise was not me." },
    { jungle: "Zorri-mah Tekkalu", translation: "If you touch that leaf, I will scream." },
    { jungle: "Ruun-vek Chalossa", translation: "I was here before you." },
    { jungle: "Vassa-nor Jekkari", translation: "Do not step on my moss." },
    { jungle: "Tolma-rii Shakka", translation: "I am watching you." },
    { jungle: "Vrenna-kol Ma’seth", translation: "This branch belongs to me." },
    { jungle: "Krovali Zen’tha", translation: "You smell unfamiliar." },
    { jungle: "Lumari Voss-ket", translation: "The rain is mine tonight." },
    { jungle: "Shaari-tok Mekketh", translation: "Go away. I am resting." },
    { jungle: "Vekka-sun Tol’rath", translation: "You are too loud." },
    { jungle: "Xelari Vroom-ta", translation: "I do not trust you." },
    { jungle: "Chessa-lo Varneth", translation: "This tree is under my protection." },
    { jungle: "Norr-ka Sil’veth", translation: "Leave before I call the others." }
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
