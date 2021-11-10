const gridEl = document.querySelector('.grid');

const game = new Game(gridEl);
game.__INIT__();

// const btnShuffle = document.querySelector('#shuffle');
const btnPlay = document.querySelector('#play');
// const btnRestart = document.querySelector('#restart');

const round = document.querySelector('.round');
const modal = document.querySelector('.overlay');

game.onRound((v) => {
    round.innerHTML = v;
    console.log(round);
    console.log('round ', v);
});

game.onRound((v) => {
    round.innerHTML = v;
    console.log(round);
    console.log('round ', v);
});

// btnShuffle.addEventListener('click', () => {
//     game.shuffle();
// });

btnPlay.addEventListener('click', () => {
    game.play();
});
