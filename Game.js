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

    emptyCell = {
        row: 0,
        col: 0,
    };

    constructor(root) {
        this.root = root;
    }

    __INIT__() {
        this.drawImg(this.root);
        this.cellsListeners();
        setTimeout(() => {
            this.shuffle();
        }, 1000);
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
                    this.updateEmptyCell(i, j);
                }

                this.grid.html[i][j] = cell;
            }
        }
        console.log(this.grid.answer);

        this.grid.html.forEach((row) => row.forEach((el) => this.root.appendChild(el)));
    };

    getEmptyCellPos() {
        return [this.emptyCell.row, this.emptyCell.col];
    }

    getEmptyCellElement() {
        return document.querySelector(`[data-id="${this.EMPTY_ID}"]`);
    }

    updateEmptyCell(row, col) {
        this.emptyCell.row = row;
        this.emptyCell.col = col;
        const emptyCellEl = this.getEmptyCellElement();
        if (emptyCellEl) {
            emptyCellEl.dataset.row = row;
            emptyCellEl.dataset.col = col;
        }
    }

    getCellElement(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    updateCellElement(oldRow, oldCol, row, col) {
        const cell = this.getCellElement(oldRow, oldCol);
        cell.dataset.row = row;
        cell.dataset.col = col;
    }

    updateCell(row, col) {
        const [emptyCellRow, emptyCellCol] = this.getEmptyCellPos();

        const emptyCell = this.getEmptyCellElement();
        const cell = this.getCellElement(row, col);

        const oldLeftPos = cell.style.left;
        const oldTopPos = cell.style.top;

        cell.style.left = emptyCell.style.left;
        cell.style.top = emptyCell.style.top;

        emptyCell.style.left = oldLeftPos;
        emptyCell.style.top = oldTopPos;

        this.grid.current[row][col] = this.EMPTY_ID;
        this.grid.current[emptyCellRow][emptyCellCol] = cell.dataset.id;

        this.updateCellElement(row, col, emptyCellRow, emptyCellCol);
        this.updateEmptyCell(row, col);
    }

    shuffle() {
        const [emptyCellRow, emptyCellCol] = this.getEmptyCellPos();

        let oldDirection = null;

        let count = 0;
        for (let i = 0; i < 10; i++) {
            const randomDirection = Math.random();
            const [emptyCellRow, emptyCellCol] = this.getEmptyCellPos();

            count++;

            const isOldDirection = (direction) => {
                return direction === oldDirection;
            };

            switch (true) {
                case randomDirection < 0.25:
                    if (isOldDirection('left') || !(emptyCellCol - 1 >= 0)) {
                        i--;
                        break;
                    } else {
                        console.log('left');
                        this.updateCell(emptyCellRow, emptyCellCol - 1);
                        oldDirection = 'left';
                    }
                    break;
                case randomDirection < 0.5:
                    if (isOldDirection('top') || !(emptyCellRow - 1 >= 0)) {
                        i--;
                        break;
                    } else if (emptyCellRow - 1 >= 0) {
                        console.log('top');
                        this.updateCell(emptyCellRow - 1, emptyCellCol);
                        oldDirection = 'top';
                    }
                    break;
                case randomDirection < 0.75:
                    if (isOldDirection('right') || !(emptyCellCol + 1 > this.params.col)) {
                        i--;
                        break;
                    } else {
                        console.log('right');
                        this.updateCell(emptyCellRow, emptyCellCol + 1);
                        oldDirection = 'right';
                    }
                    break;
                case randomDirection < 1:
                    // isOldDirection('left');
                    if (isOldDirection('bottom') || !(emptyCellRow + 1 < this.params.row)) {
                        i--;
                        break;
                    } else {
                        console.log('bottom');
                        this.updateCell(emptyCellRow + 1, emptyCellCol);
                        oldDirection = 'bottom';
                    }
                    break;
            }
            // console.log('shuffle');
        }
        console.log(count);
        console.log('emptyCellRow ', emptyCellRow);
        console.log('emptyCellCol ', emptyCellCol);
    }

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

                    const [emptyCellRow, emptyCellCol] = this.getEmptyCellPos();

                    if (this.isValidPosition(row, col, emptyCellRow, emptyCellCol)) {
                        console.log('VALID');
                        this.updateCell(row, col);
                    }
                });
            });
        });
    };

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
