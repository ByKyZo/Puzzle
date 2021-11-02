class Game {
    EMPTY_ID = -1;
    root;
    params = {
        row: 3,
        col: 3,
        imgRootWidth: 500,
        imgRootHeight: 500,
        getImgWidth: function () {
            return this.imgRootWidth / this.col;
        },
        getImgHeight: function () {
            return this.imgRootHeight / this.row;
        },
    };

    grid = {
        current: [],
        answer: [],
        html: [],
    };

    constructor(root) {
        this.root = root;
    }

    __INIT__() {
        this.drawImg(this.root);
        this.init();
    }

    drawImg = () => {
        const imgURL = `https://picsum.photos/${this.params.imgRootWidth}/${this.params.imgRootHeight}`;
        const randomRow = this.randomInt(0, this.params.row - 1);
        const randomCol = this.randomInt(0, this.params.col - 1);
        let ID = -1;

        const isEmptyCell = (row, col) => {
            return row === randomRow && col === randomCol;
        };

        for (let i = 0; i < this.params.row; i++) {
            this.grid.answer[i] = [];
            this.grid.html[i] = [];

            for (let j = 0; j < this.params.col; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                cell.style.width = `${this.params.getImgWidth()}px`;
                cell.style.height = `${this.params.getImgHeight()}px`;
                cell.style.left = `${this.params.getImgWidth() * j}px`;
                cell.style.top = `${this.params.getImgHeight() * i}px`;
                cell.dataset.col = j;
                cell.dataset.row = i;

                if (!isEmptyCell(i, j)) {
                    cell.style.backgroundImage = `url(${imgURL})`;
                    cell.style.backgroundPositionX = `-${this.params.getImgWidth() * j}px`;
                    cell.style.backgroundPositionY = `-${this.params.getImgHeight() * i}px`;

                    ID++;
                    cell.dataset.id = ID;
                    this.grid.answer[i][j] = ID;
                } else {
                    cell.dataset.id = this.EMPTY_ID;
                    this.grid.answer[i][j] = this.EMPTY_ID;
                }

                this.grid.html[i][j] = cell;
            }
        }
        console.log(this.grid.answer);

        this.grid.html.forEach((row) => row.forEach((el) => this.root.appendChild(el)));
    };

    isValidPosition = (row, col, emptyRow, emptyCol) => {
        return (
            (row + 1 === emptyRow + 1 && col === emptyCol) ||
            (row - 1 === emptyRow - 1 && col === emptyCol) ||
            (row === emptyRow && col + 1 === emptyCol + 1) ||
            (row === emptyRow && col - 1 === emptyCol - 1)
        );
    };

    init = () => {
        this.grid.html.forEach((rowEl) => {
            rowEl.forEach((el) => {
                el.addEventListener('click', () => {
                    const row = el.dataset.row;
                    const col = el.dataset.col;
                    const cellID = el.dataset.id;

                    const emptyCell = document.querySelector(`[data-id="${this.EMPTY_ID}"]`);
                    const emptyCellRow = emptyCell.dataset.row;
                    const emptyCellCol = emptyCell.dataset.col;
                    console.log(emptyCell);
                    console.log(emptyCellRow);
                    console.log(emptyCellCol);
                    if (this.isValidPosition(row, col, emptyCellRow, emptyCellCol)) {
                        console.log('VALID');
                    }

                    // console.log('ROW = ', row);
                    // console.log('COL = ', col);
                    // console.log('ID = ', cellID);
                    // console.log('emptyEl = ', emptyCell);
                });
            });
        });
    };

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
