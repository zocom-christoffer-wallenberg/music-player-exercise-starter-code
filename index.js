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

let token = '';

function playSong(song) {
    console.log('Selected song: ', song);
    audio.src = song.preview_url;
    //audio.play();
}

async function getToken() {
    const response = await fetch('https://blooming-reef-63913.herokuapp.com/api/token');
    const data = await response.json();
    token = data.token;
    console.log(token);
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
    playSong(data.tracks.items[0])
}

searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    getSongs(query);
});

getToken();