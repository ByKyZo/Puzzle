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
        this.cellsListeners();
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
            this.grid.current[i] = [];
            this.grid.html[i] = [];

            for (let j = 0; j < this.params.col; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                cell.style.width = `${this.params.getImgWidth()}px`;
                cell.style.height = `${this.params.getImgHeight()}px`;
                cell.style.left = `${this.params.getImgWidth() * j}px`;
                cell.style.top = `${this.params.getImgHeight() * i}px`;
                // cell.style.transform = `translate(${this.params.getImgWidth() * j}px,${
                //     this.params.getImgWidth() * i
                // }px)`;
                cell.dataset.col = j;
                cell.dataset.row = i;

                if (!isEmptyCell(i, j)) {
                    cell.style.backgroundImage = `url(${imgURL})`;
                    cell.style.backgroundPositionX = `-${this.params.getImgWidth() * j}px`;
                    cell.style.backgroundPositionY = `-${this.params.getImgHeight() * i}px`;

                    ID++;
                    cell.dataset.id = ID;
                    this.grid.answer[i][j] = ID;
                    this.grid.current[i][j] = ID;
                } else {
                    cell.dataset.id = this.EMPTY_ID;
                    this.grid.answer[i][j] = this.EMPTY_ID;
                    this.grid.current[i][j] = this.EMPTY_ID;
                }

                this.grid.html[i][j] = cell;
            }
        }
        console.log(this.grid.answer);

        this.grid.html.forEach((row) => row.forEach((el) => this.root.appendChild(el)));
    };

    isValidPosition = (row, col, emptyRow, emptyCol) => {
        return (
            (row === emptyRow + 1 && col === emptyCol) ||
            (row === emptyRow - 1 && col === emptyCol) ||
            (row === emptyRow && col === emptyCol + 1) ||
            (row === emptyRow && col === emptyCol - 1)
        );
    };

    cellsListeners = () => {
        this.grid.html.forEach((rowEl) => {
            rowEl.forEach((el) => {
                el.addEventListener('click', () => {
                    const row = +el.dataset.row;
                    const col = +el.dataset.col;
                    const cellID = +el.dataset.id;

                    const emptyCell = document.querySelector(`[data-id="${this.EMPTY_ID}"]`);
                    const emptyCellRow = +emptyCell.dataset.row;
                    const emptyCellCol = +emptyCell.dataset.col;

                    if (this.isValidPosition(row, col, emptyCellRow, emptyCellCol)) {
                        console.log('VALID');

                        const oldLeftPos = el.style.left;
                        const oldTopPos = el.style.top;

                        el.style.left = emptyCell.style.left;
                        el.style.top = emptyCell.style.top;

                        emptyCell.style.left = oldLeftPos;
                        emptyCell.style.top = oldTopPos;

                        this.grid.current[row][col] = this.EMPTY_ID;
                        this.grid.current[emptyCellRow][emptyCellCol] = cellID;

                        el.dataset.row = emptyCellRow;
                        el.dataset.col = emptyCellCol;
                        emptyCell.dataset.row = row;
                        emptyCell.dataset.col = col;

                        console.log(this.grid.current);
                    }
                });
            });
        });
    };

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
