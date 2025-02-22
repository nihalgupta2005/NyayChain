
let main_url = 'https://api.mymemory.translated.net/get?q=';

const btn = document.querySelector('.btn');
const inputValue = document.getElementById('translateFromTXTArea');
const translation = document.getElementById('translateToTXTArea');
const languagesFrom = document.getElementById('languagesFrom');
const languagesTo = document.getElementById('languagesTo');
const icon = document.getElementById('icon');
const closeBtn = document.getElementById('close');
const speakBtn = document.getElementById('speak');
const listenBtn = document.getElementById('listen');
const micBtn = document.getElementById('mic');

// Event Listeners
btn.addEventListener('click', funcBtn);
speakBtn.addEventListener('click', speakText);
micBtn.addEventListener('click', recordSpeech);
listenBtn.addEventListener('click', listenToTranslation);
inputValue.addEventListener('keypress', function (e) {
    if (e.key === "Enter") funcBtn();
});

// Function to translate text with animations
function funcBtn() {
    let translateFrom = languagesFrom.value;
    let translateTo = languagesTo.value;
    let text = inputValue.value;

    if (!text) return;

    translation.setAttribute("placeholder", "⏳ Translating...");
    translation.classList.add("loading"); // Add animation

    fetch(`${main_url}${text}&langpair=${translateFrom}|${translateTo}`)
        .then(response => response.json())
        .then(data => {
            setTimeout(() => { // Smooth transition effect
                translation.value = data.responseData.translatedText;
                translation.classList.remove("loading"); // Remove animation
            }, 1000);
        })
        .catch(error => {
            console.error("Translation Error: ", error);
            translation.value = "❌ Translation failed!";
        });
}

// Function for Speech-to-Text (STT) with animation
function recordSpeech() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = languagesFrom.value;
    micBtn.classList.add("recording"); // Start animation
    recognition.start();

    recognition.onresult = function (event) {
        inputValue.value = event.results[0][0].transcript;
        micBtn.classList.remove("recording"); // Stop animation
        funcBtn();
    };

    recognition.onerror = function () {
        alert("❌ Speech recognition error!");
        micBtn.classList.remove("recording"); // Stop animation
    };
}

// Function to listen to translated text (Text-to-Speech)
function listenToTranslation() {
    let textToSpeak = translation.value;
    if (!textToSpeak) return;

    let speech = new SpeechSynthesisUtterance();
    speech.text = textToSpeak;
    speech.lang = languagesTo.value;
    speech.rate = 1;

    listenBtn.classList.add("playing"); // Animation
    window.speechSynthesis.speak(speech);

    speech.onend = () => {
        listenBtn.classList.remove("playing"); // Remove animation
    };
}

// Function to swap input and output languages with animation
icon.addEventListener("click", () => {
    [inputValue.value, translation.value] = [translation.value, inputValue.value];
    [languagesFrom.value, languagesTo.value] = [languagesTo.value, languagesFrom.value];

    icon.classList.add("rotate"); // Animation
    setTimeout(() => icon.classList.remove("rotate"), 500);
});

// Close button functionality with fade effect
closeBtn.addEventListener('click', () => {
    inputValue.value = '';
    translation.value = '';
    translation.classList.add("fadeOut");

    setTimeout(() => {
        translation.classList.remove("fadeOut");
        translation.setAttribute("placeholder", "Translation");
    }, 500);
});

// Show/hide close button based on input
inputValue.addEventListener("keyup", () => {
    closeBtn.classList.toggle('hidden', !inputValue.value);
});

