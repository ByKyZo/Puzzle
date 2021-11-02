const gridEl = document.querySelector('.grid');

const game = new Game(gridEl);
game.__INIT__();

// let params = {
//     row: 3,
//     col: 3,
//     imgRootWidth: 500,
//     imgRootHeight: 500,
//     getImgWidth: function () {
//         return this.imgRootWidth / this.col;
//     },
//     getImgHeight: function () {
//         return this.imgRootHeight / this.row;
//     },
// };

// const EMPTY_ID = -1;

// const grid = {
//     current: [],
//     answer: [],
//     html: [],
// };

// const drawImg = () => {
//     const imgURL = `https://picsum.photos/${params.imgRootWidth}/${params.imgRootHeight}`;
//     let ID = -1;

//     for (let i = 0; i < params.row; i++) {
//         grid.answer[i] = [];
//         grid.html[i] = [];

//         for (let j = 0; j < params.col; j++) {
//             const image = document.createElement('div');
//             image.classList.add('cell');
//             image.style.backgroundImage = `url(${imgURL})`;
//             image.style.width = `${params.getImgWidth()}px`;
//             image.style.height = `${params.getImgHeight()}px`;
//             image.style.backgroundPositionX = `-${params.getImgWidth() * j}px`;
//             image.style.backgroundPositionY = `-${params.getImgHeight() * i}px`;
//             image.dataset.orderX = j;
//             image.dataset.orderY = i;

//             ID++;
//             image.dataset.id = ID;
//             grid.answer[i][j] = ID;

//             grid.html[i][j] = image;
//         }
//     }
//     console.log(grid.answer);

//     let emptyArea = document.createElement('span');
//     emptyArea.style.width = `${params.getImgWidth()}px`;
//     emptyArea.style.height = `${params.getImgHeight()}px`;
//     emptyArea.dataset.id = EMPTY_ID;

//     const randomRow = randomInt(0, params.row - 1);
//     const randomCol = randomInt(0, params.col - 1);

//     grid.html[randomRow][randomCol] = emptyArea;
//     grid.answer[randomRow][randomCol] = EMPTY_ID;

//     grid.html.forEach((row) => row.forEach((el) => gridEl.appendChild(el)));
// };

// const init = () => {
//     grid.html.forEach((row) => {
//         row.forEach((el) => {
//             el.addEventListener('click', () => {
//                 console.log(el.dataset.id);
//             });
//         });
//     });
// };

// // const randomizePosition () {
// //     grid.html
// // }

// drawImg();
// init();
