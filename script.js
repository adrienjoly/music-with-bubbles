// source: https://chatgpt.com/share/67271f90-ff1c-8013-bb03-b007ce9478f2/continue

// Remplace par ta clé API YouTube et ta clé API OpenAI
// const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
// const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// Fonction principale
// async function fetchAndDisplayVideoAndFacts(songTitle) {
//   // Recherche de la vidéo sur YouTube
//   const videoId = await getYouTubeVideoId(songTitle);
//   if (videoId) {
//     embedYouTubeVideo(videoId);
//     const facts = await getSongFacts(songTitle);
//     if (facts.length > 0) {
//       displayFacts(facts);
//     } else {
//       console.log('Aucun fait trouvé.');
//     }
//   } else {
//     console.log('Vidéo non trouvée.');
//   }
// }

// Recherche de l'ID de la vidéo sur YouTube
// async function getYouTubeVideoId(songTitle) {
//   const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(songTitle)}&key=${YOUTUBE_API_KEY}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   if (data.items && data.items.length > 0) {
//     return data.items[0].id.videoId;
//   }
//   return null;
// }

// Intégration de la vidéo YouTube dans un div
function embedYouTubeVideo(videoId, showFactAtSecond) {
  // const videoDiv = document.getElementById('video-container');
  // videoDiv.innerHTML = `<iframe id="youtube-video" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  
// 1. Charge l'API YouTube Iframe Player
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    const player = new window.YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId,
      playerVars: {
          'autoplay': 1,
          'controls': 1,
          'rel': 0, // vidéos connexes
          'showinfo': 0 // informations de la vidéo
      },
      events: {
        onReady: (event) => {
          setInterval(() => {
            const currentTime = player.getCurrentTime();
            console.log("Temps actuel de la vidéo : " + currentTime + " secondes");
            showFactAtSecond(currentTime)
          }, 1000); // Vérifiez chaque seconde
        },
        'onStateChange': (event) => {
            console.log('onStateChange', event.data)
            if (event.data == window.YT.PlayerState.ENDED) {
                console.log("La vidéo est terminée.");
            }
        }
      },
    });
  }

}

// Recherche des faits associés via l'API d'OpenAI
// async function getSongFacts(songTitle) {
//   const response = await fetch('https://api.openai.com/v1/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${OPENAI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'text-davinci-003',
//       prompt: `Donne-moi une liste de 10 faits intéressants sur la chanson et le clip intitulés "${songTitle}", sous forme de courtes puces d'une phrase (20 mots maximum chacune).`,
//       max_tokens: 500,
//       temperature: 0.7
//     })
//   });
//   const data = await response.json();
//   const facts = data.choices[0].text.trim().split('\n').filter(fact => fact.length > 0);
//   return facts;
// }

// Affichage des faits sur la vidéo
function displayFacts(facts) {
  const factDiv = document.createElement('div');
  factDiv.style.position = 'absolute';
  factDiv.style.top = '10px';
  factDiv.style.right = '10px';
  factDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  factDiv.style.color = 'white';
  factDiv.style.padding = '10px';
  factDiv.style.borderRadius = '5px';
  factDiv.style.zIndex = '1000';
  factDiv.style.display = 'none';
  document.body.appendChild(factDiv);
  
  const PAUSE_DURATION = 5; // seconds
  const BUBBLE_DISPLAY_DURATION = 25; // seconds
  const TOTAL_DURATION_PER_FACT = PAUSE_DURATION + BUBBLE_DISPLAY_DURATION; // seconds

  return (second) => {
    const pause = second % TOTAL_DURATION_PER_FACT <= PAUSE_DURATION;
    factDiv.style.display = pause ? 'none' : 'block';
    if (!pause) {
      const index = Math.ceil(second / TOTAL_DURATION_PER_FACT);
      factDiv.textContent = facts[index];
    }
  }
}

// Appel de la fonction pour tester avec une chanson
// fetchAndDisplayVideoAndFacts('Roxanne, The Police');

const facts = [
    "Le morceau fait partie de l'album « Notre-Dame-des-Sept-Douleurs » sorti en 2020.",
    "La chanson évoque la perte et les souvenirs liés à un être cher.",
    "Le clip officiel a été réalisé avec une esthétique onirique et poétique.",
    "Les visuels du clip explorent des thèmes de rêve et de surréalisme.",
    "Klô Pelgag a écrit la chanson en hommage à sa mère.",
    "L'arrangement musical intègre des éléments orchestraux et des instruments non conventionnels.",
    "Le clip est connu pour ses couleurs vives et ses symboles mystérieux.",
    "« Le goût des mangues » est l'une des chansons les plus poignantes de l'album.",
    "Klô Pelgag mélange harmonieusement poésie et mélodie dans cette chanson.",
    "Le clip a été acclamé pour sa direction artistique et sa créativité."
  ];
embedYouTubeVideo('t7oH8GBosLg', displayFacts(facts)); // Klô Pelgag - Le goût des mangues (Vidéo officielle)
