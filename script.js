// inicjalizacja zmiennych dla czasomierza i prób
let timer = 0;
let attempts = 0;
let timerInterval;

// przycisk startu gry gdy użytkownik na niego naciśnie 
document.getElementById('startButton').addEventListener('click', function() {
    // ukryj ekran startowy, pokaż planszę 
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('game').style.display = 'grid'; 
    document.getElementById('infoContainer').style.display = 'block'; 
    // stwórz planszę gry
    createBoard();
    // zeruj liczbę prób oraz czasomierz
    attempts = 0;
    timer = 0;
    // wyświetl początkowe wartości czasomierza i prób
    document.getElementById('timerDisplay').innerText = `Czas: ${timer.toFixed(2)} sekund`;
    document.getElementById('attemptsDisplay').innerText = `Próby: ${attempts}`;
    // uruchom czasomierz
    startTimer();
});

// funkcja rozpoczynająca czasomierz
function startTimer() {
    // uruchom czasomierz z interwałem 10ms
    timerInterval = setInterval(() => {
        timer += 0.01; // zwiększ czasomierz o 0.01 sekundy
        // wyświetl aktualny czasomierz na ekranie
        document.getElementById('timerDisplay').innerText = `Czas: ${timer.toFixed(2)} sekund`;
    }, 10);
}

// funkcja zatrzymująca czasomierz
function stopTimer() {
    clearInterval(timerInterval); // zatrzymaj
}

// główny script strony
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game'); // kontener gry
    const symbols = ['🍇', '🎲', '🌈', '🚀', '🌀', '🎵', '🎮', '🎭', '🎨', '🌺', '🍀', '🍒', '🌱', '🍄', '🌼', '🎉', '🎈', '🍐', '🎸', '🎀', '🎓', '🎒', '🌴', '🌵', '🖼️', '🏆', '🎤'];
    let hasFlippedCard = false; // zmienna śledząca, czy została odwrócona karta
    let lockBoard = false; // zmienna blokująca planszę podczas odwracania kart
    let firstCard, secondCard;

    // funkcja tworząca planszę gry randomowo
    function createBoard() {
        const cards = [];
        // dla każdego symbolu w tablicy symboli
        for (let i = 0; i < symbols.length; i++) {
            // stwórz dwie karty z tym samym symbolem
            const card1 = createCardElement(symbols[i]);
            const card2 = createCardElement(symbols[i]);
            // dodaj obie karty do tablicy kart
            cards.push(card1, card2);
        }
        // wymieszaj karty
        cards.sort(() => 0.5 - Math.random());
        // dodaj każdą kartę do kontenera gry na stronie
        cards.forEach(card => gameContainer.appendChild(card));
    }

    // funkcja tworząca element karty
    function createCardElement(symbol) {
        const cardElement = document.createElement('div'); // stwórz nowy element div reprezentujący kartę
        cardElement.classList.add('card'); // dodaj klasę 'card' do elementu karty

        // stwórz element przedniej strony karty
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face'); // dodaj klasę 'front-face' do przedniej strony karty
        frontFace.textContent = symbol; // ustaw tekst przedniej strony karty na symbol

        // stwórz element tylnej strony karty
        const backFace = document.createElement('div');
        backFace.classList.add('back-face'); // dodaj klasę 'back-face' do tylnej strony karty
        backFace.textContent = '?'; // ustaw tekst tylnej strony karty na znak zapytania

        // dodaj elementy do karty
        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);

        // dodaj obsługę zdarzenia kliknięcia na kartę
        cardElement.addEventListener('click', flipCard);

        return cardElement; // zwróć stworzony element karty
    }

    // funkcja obsługująca kliknięcie na kartę (odwrócenie karty)
    function flipCard() {
        // jeśli plansza jest zablokowana lub karta została już odwrócona lub kliknięta, nie rób nic
        if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;
        
        this.classList.add('flipped'); // dodaj klasę 'flipped' do klikniętej karty

        // jeśli to pierwsza odwrócona karta
        if (!hasFlippedCard) {
            hasFlippedCard = true; // ustaw flagę na true, że pierwsza karta została odwrócona
            firstCard = this; // zapisz pierwszą odwróconą kartę
            attempts++; // zwiększ liczbę prób
            document.getElementById('attemptsDisplay').innerText = `Próby: ${attempts}`; // wyświetl liczbę prób na ekranie
            if (attempts === 1) {
                startTimer(); // jeśli to pierwsza karta, uruchom czasomierz
            }
            return;
        }

        secondCard = this; // zapisz drugą odwróconą kartę
        checkForMatch(); // sprawdź, czy karty pasują do siebie
    }

    // funkcja sprawdzająca, czy odwrócone karty pasują do siebie
    function checkForMatch() {
        let isMatch = firstCard.textContent === secondCard.textContent; // sprawdź, czy symbol na kartach jest taki sam
        isMatch ? disableCards() : unflipCards(); // jeśli pasują, usuń pary kart, w przeciwnym razie odwróć karty z powrotem
    }

    // funkcja usuwająca pasujące karty
    function disableCards() {
        lockBoard = true; // dodaj blokadę planszy podczas dezaktywacji kart
        firstCard.style.transition = 'opacity 0.5s'; // dodaj efekt przejścia przy zmianie przezroczystości
        secondCard.style.transition = 'opacity 0.5s'; // dodaj efekt przejścia przy zmianie przezroczystości
        firstCard.style.opacity = '0'; // ustaw przezroczystość na 0 dla pierwszej karty
        secondCard.style.opacity = '0'; // ustaw przezroczystość na 0 dla drugiej karty
        firstCard.style.pointerEvents = 'none'; // wyłącz obsługę zdarzeń na pierwszej karcie
        secondCard.style.pointerEvents = 'none'; // wyłącz obsługę zdarzeń na drugiej karcie

        resetBoard(); // zresetuj planszę
        checkGameOver(); // sprawdź, czy gra została ukończona
    }

    // funkcja odwracająca karty z powrotem, jeśli nie pasują
    function unflipCards() {
        lockBoard = true; // dodaj blokadę planszy podczas odwracania kart z powrotem
        setTimeout(() => {
            firstCard.classList.remove('flipped'); // usuń klasę 'flipped' z pierwszej karty
            secondCard.classList.remove('flipped'); // usuń klasę 'flipped' z drugiej karty
            resetBoard(); // zresetuj planszę
        }, 1000); // animacja opóźnienie 1 sekundy
    }

    // funkcja resetująca planszę gry
    function resetBoard() {
        // zresetuj zmienne
        [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
    }

    // Funkcja sprawdzająca, czy gra została ukończona
    function checkGameOver() {
        // Pobiera wszystkie elementy kart z DOM
        const allCards = document.querySelectorAll('.card');
        // Pobiera tylko te karty, które zostały dopasowane (ich styl opacity ustawiony na 0)
        const matchedCards = document.querySelectorAll('.card[style*="opacity: 0"]');
    
        // sprawdza, czy liczba dopasowanych kart jest równa liczbie wszystkich kart
            if (matchedCards.length === allCards.length) {
        // jeśli tak, uruchamia funkcję po 0,5 sekundy, aby dać użytkownikowi czas na zobaczenie ostatniej pary
        setTimeout(() => {
            // wyświetla okno dialogowe z gratulacjami, czasem gry i liczbą prób, oraz pyta o restart
            const restart = confirm(`Gratulacje! Ukończyłeś grę w czasie: ${timer.toFixed(2)} sekund i ${attempts} próbach. Naciśnij OK, jeżeli chcesz zagrać ponownie:)`);
            // jeśli użytkownik kliknie OK (confirm zwróci true), gra zostanie zresetowana
            if (restart) {
                resetGame(); // wywołuje funkcję resetującą grę
            }
        }, 500); // zzas opóźnienia przed wyświetleniem komunikatu, aby użytkownik mógł zobaczyć efekt końcowy
        }
    }

    // funkcja resetująca grę do stanu początkowego
    function resetGame() {
        stopTimer(); // Zatrzymaj czasomierz, jeśli jeszcze działa
        const gameContainer = document.getElementById('game'); // pobierz kontener gry
        gameContainer.innerHTML = ''; // wyczyść zawartość kontenera
        attempts = 0; // zresetuj liczbę prób
        timer = 0; // zresetuj czasomierz
    // wyświetl początkowe wartości czasomierza i prób
    document.getElementById('timerDisplay').innerText = `Czas: ${timer.toFixed(2)} sekund`;
    document.getElementById('attemptsDisplay').innerText = `Próby: ${attempts}`;
        createBoard(); // stwórz planszę gry na nowo z nowym ułożeniem kart
    document.getElementById('startScreen').style.display = 'none'; // ukryj ekran startowy
    document.getElementById('game').style.display = 'grid'; // pokaż planszę gry
    document.getElementById('infoContainer').style.display = 'block'; // pokaż kontener z informacjami
}


    // stwórz planszę gry przy załadowaniu strony
    createBoard();
});
