
const $ = (selector) => document.querySelector(selector);

const introScreen = $("#introScreen");
const missionScreen = $("#missionScreen");
const finalScreen = $("#finalScreen");

const startBtn = $("#startBtn");
const nextBtn = $("#nextBtn");
const replayBtn = $("#replayBtn");
const surpriseBtn = $("#surpriseBtn");

const stageHeading = $("#stageHeading");
const levelBadge = $("#levelBadge");
const progressFill = $("#progressFill");

const challengeIcon = $("#challengeIcon");
const challengeLabel = $("#challengeLabel");
const questionTitle = $("#questionTitle");
const questionDescription = $("#questionDescription");
const optionsContainer = $("#options");
const feedback = $("#feedback");

const extraMessage = $("#extraMessage");
const toast = $("#toast");
const particles = $("#particles");

let currentStage = 0;
let answered = false;
let toastTimer;

const stages = [
    {
        icon: "🔐",
        heading: "1. Aşama: Zekâ Testi",
        label: "GÜVENLİK KONTROLÜ 01",
        title: "Neredeyse imkânsız bir görevin var...",
        description:
            "İlk soru: Diyelim ki sevdiğin kişi sana seni sevmediğini söyledi. Ne yaparsın?",
        options: [
            {
                text: "A) Ona inanır ve giderim ",
            },
            {
                text: "B) Terlikle kafasına vururum ",
            },
            {
                text: "C) Gerçeği kendim öğrenirim ",
            },
        ],
        success:
            "İlk testi geçtin... Gerçi verdiğin cevaplara pek güvenemedik ",
    },
    {
        icon: "🧠",
        heading: "2. Aşama: Yalan Dedektörü",
        label: "YALAN DEDEKTÖRÜ 02",
        title: "Sistem garip bir şey fark etti!",
        description:
            "Şüpheli, günde 24 saat boyunca belli bir kişiyi düşünüyor. Sence bu kişi kim?",
        options: [
            {
                text: "A) Yemek ",
            },
            {
                text: "B) Tabii ki ben ",
            },
            {
                text: "C) Başka biri mi var? ",
            },
        ],
    },
    {
        icon: "🚨",
        heading: "3. Aşama: Son Karar",
        label: "SON ONAY 03",
        title: "Gizli dosya açılmadan önceki son soru",
        description:
            "Sürekli seninle uğraşan, çok şaka yapan ama seni gerçekten seven biriyle birlikte olmaya devam etmeyi kabul ediyor musun?",
        options: [
            {
                text: "A) Kabul ediyorum ama ona dünyayı dar edeceğim ",
            },
            {
                text: "B) Kabul ediyorum ama bana yemek ısmarlaması şart ",
            },
            {
                text: "C) Kabul ediyorum çünkü onu seviyorum ",
            },
        ],
        success:
            "Bir kişinin kalbinden ömür boyu sorumlu olmak üzere resmen onaylandın ",
    },
];

function showScreen(screenToShow) {
    [introScreen, missionScreen, finalScreen].forEach((screen) => {
        screen.classList.remove("active");
    });

    screenToShow.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function renderStage() {
    const stage = stages[currentStage];

    answered = false;

    stageHeading.textContent = stage.heading;
    levelBadge.textContent =
        `0${currentStage + 1} / 0${stages.length}`;

    progressFill.style.width =
        `${(currentStage / stages.length) * 100}%`;

    challengeIcon.textContent = stage.icon;
    challengeLabel.textContent = stage.label;
    questionTitle.textContent = stage.title;
    questionDescription.textContent = stage.description;

    feedback.textContent = "";
    nextBtn.classList.add("hidden");
    optionsContainer.replaceChildren();

    stage.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "option-btn";
        button.textContent = option.text;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsContainer.appendChild(button);
    });
}

function selectAnswer(index) {
    if (answered) return;

    answered = true;

    const stage = stages[currentStage];
    const buttons = optionsContainer.querySelectorAll(".option-btn");

    buttons.forEach((button, buttonIndex) => {
        button.disabled = true;

        if (buttonIndex === index) {
            button.classList.add("chosen");
        }
    });

    feedback.textContent = stage.options[index].feedback || "";

    nextBtn.classList.remove("hidden");

    if (currentStage === stages.length - 1) {
        nextBtn.innerHTML =
            "Gizli mesajı aç ❤️ <span>←</span>";
    } else {
        nextBtn.innerHTML =
            "Göreve devam et <span>←</span>";
    }
}

function startMission() {
    currentStage = 0;

    showScreen(missionScreen);
    renderStage();
}

function continueMission() {
    if (!answered) {
        showToast("Önce bir cevap ver, ajan hanım 😂");
        return;
    }

    if (currentStage < stages.length - 1) {
        if (stages[currentStage].success) {
            showToast(stages[currentStage].success);
        }

        currentStage++;

        renderStage();

        progressFill.style.width =
            `${(currentStage / stages.length) * 100}%`;

        return;
    }

    progressFill.style.width = "100%";

    showScreen(finalScreen);
    launchHearts();
}

function launchHearts() {
    const emojis = ["❤️", "💕", "💖", "💗", "✨", "💘"];

    for (let i = 0; i < 32; i++) {
        const particle = document.createElement("span");

        particle.className = "particle";
        particle.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize = `${14 + Math.random() * 20}px`;
        particle.style.animationDuration =
            `${4 + Math.random() * 4}s`;
        particle.style.animationDelay =
            `${Math.random() * 2}s`;

        particles.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        }, { once: true });
    }
}

function replayMission() {
    extraMessage.classList.add("hidden");
    extraMessage.textContent = "";

    if (surpriseBtn) {
        surpriseBtn.disabled = false;
        surpriseBtn.textContent = "Beni seviyorsan buraya tıkla 👀";
    }

    startMission();
}

function revealExtraMessage() {
    extraMessage.textContent =
        "Sürpriz! 😂❤️ Sihirli bir düğme olduğunu mu sandın? " +
        "Görevin sonuna geldin ama benim tatlı dırdırıma " +
        "daha çok katlanacaksın. Seni seviyorum, dünyanın " +
        "en tatlı gizli ajanı! 💌";

    extraMessage.classList.remove("hidden");

    surpriseBtn.disabled = true;
    surpriseBtn.textContent = "Bütün sırlar açığa çıktı ❤️";

    launchHearts();
}

startBtn.addEventListener("click", startMission);
nextBtn.addEventListener("click", continueMission);
replayBtn.addEventListener("click", replayMission);

if (surpriseBtn) {
    surpriseBtn.addEventListener("click", revealExtraMessage);
}

// Ana ekranda süzülen küçük semboller.
function createBackgroundParticle() {
    if (particles.children.length > 45) return;

    const particle = document.createElement("span");
    const emojis = ["♡", "✦", "·"];

    particle.className = "particle";
    particle.textContent =
        emojis[Math.floor(Math.random() * emojis.length)];

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.fontSize = `${12 + Math.random() * 14}px`;
    particle.style.animationDuration =
        `${6 + Math.random() * 6}s`;

    particles.appendChild(particle);

    particle.addEventListener("animationend", () => {
        particle.remove();
    }, { once: true });
}

setInterval(createBackgroundParticle, 900);
