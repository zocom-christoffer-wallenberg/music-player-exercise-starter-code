/*
    Musikspelare

    1. Hämta token från https://blooming-reef-63913.herokuapp.com/api/token och
    spara i en variabel
    2. Lägg till inputfält för att söka efter låtar och knapp.
    3. Gör anrop till Spotify API med söksträng och token.
    4. För varje låt i svaret
        1. Skapa ett element
        2. Lägg till titel i element som text som ska visas
        3. Lägg till elementet i HTML:en
        4. Lägg till en eventlistener på elementet
    5. När jag klickar på en låt
        1. Hämta preview url från den låten
        2. Lägg till preview url som src i audio-taggen
        3. Spela upp låten.
*/

const audio = document.getElementById('audio-player');
const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const songsWrapper = document.getElementById('songs');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const backwardBtn = document.querySelector('#backward');
const forwardBtn = document.querySelector('#forward');
const progressBar = document.querySelector('#progressBar');

//HÄMTA MUSIK OCH VISA
let token = '';

function playSong(url) {
    console.log('Selected song: ', song);
    audio.src = url;
}

async function getToken() {
    const response = await fetch('https://blooming-reef-63913.herokuapp.com/api/token');
    const data = await response.json();
    token = data.token;
    console.log(token);
}

//Lista alla låtar på webbsidan

function displaySongs(songs) {
    songsWrapper.innerHTML = '';

    for(song of songs) {
        console.log(song);
        const songElem = document.createElement('p');
        songElem.innerHTML = 'Låt: ' + song.name + ' Artist: ' + song.artists[0].name;
        songElem.setAttribute('url', song.preview_url);
        console.log(songElem);
        songsWrapper.append(songElem); //Lägg till den skapade p-taggen i article med id songs

        //Lägg till en addEventListener på varje p-tagg och när man klickar på den hämta url:en från p-taggen
        songElem.addEventListener('click', (event) => {
            console.log('Du klickade på: ', event.target);
            console.log(event.target.getAttribute('url'));
            const preview_url = event.target.getAttribute('url');
            if (preview_url !== 'null') {
                playSong(preview_url);
            }
        });
    }
}

//https://api.spotify.com/v1/search?q=spirit%20of%20the%20season&type=track
async function getSongs(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}`+
    '&type=track', {
        headers: {
            'authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    console.log(data);
    displaySongs(data.tracks.items);
}

searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    getSongs(query);
});

getToken();


//MUSIKSPELAREN
function togglePlayAndPause() {
    playBtn.classList.toggle('hide');
    pauseBtn.classList.toggle('hide');
}

playBtn.addEventListener('click', () => {
    audio.play();

    togglePlayAndPause();
});

pauseBtn.addEventListener('click', () => {
    audio.pause();
    togglePlayAndPause();
});

forwardBtn.addEventListener('click', () => {
    if (!audio.paused) {
        audio.currentTime = parseInt(audio.currentTime + 10);
    }
});

backwardBtn.addEventListener('click', () => {
    if (!audio.paused) {
        audio.currentTime = parseInt(audio.currentTime - 10);
    }
});

audio.addEventListener('timeupdate', () => {
    //Din funktion körs varje sekund och räknar ut hur långt i procent vi har kommit i låten
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
});