class Game {
    EMPTY_ID = -1;
    isWin = false;
    isStarted = false;
    isInShuffle = false;
    round = 0;
    roundProxy = new Proxy({ round: this.round }, () => {
        console.log('round change');
    });
    root;
    roundState = {
        value: 0,
        listener: function (callback) {
            callback && callback(this.value);
        },
        set: function (setCallback, callback) {
            this.value = setCallback(this.value);
            this.listener(callback);
        },
    };

    incRound() {
        this.roundState.set((value) => (value += 1), this.roundListenerCallback);
    }

    onRound(callback) {
        this.roundListenerCallback = callback;
    }

    params = {
        shuffleRound: 100,
        timeout: 50,
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
    }

    play() {
        this.shuffle();
        this.isStarted = true;
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
                cell.style.transition = `${this.params.timeout}ms`;
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
                    cell.classList.add('__empty-cell');
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

        this.grid.current[row][col] = +this.EMPTY_ID;
        this.grid.current[emptyCellRow][emptyCellCol] = +cell.dataset.id;

        this.updateCellElement(row, col, emptyCellRow, emptyCellCol);
        this.updateEmptyCell(row, col);
    }

    checkWin() {
        const answerFlat = this.grid.answer.flat();
        const currentFlat = this.grid.current.flat();
        if (answerFlat.every((e, i) => e === currentFlat[i])) {
            this.isWin = true;
            console.log('----W-I-N----');
        }
    }

    async shuffle() {
        if (this.isInShuffle) return;

        this.isInShuffle = true;

        let oldDirection = null;

        const wait = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.params.timeout);
            });
        };

        const memo = [];

        for (let i = 0; i < this.params.shuffleRound; i++) {
            const [emptyCellRow, emptyCellCol] = this.getEmptyCellPos();

            let possibleDir = [];

            emptyCellCol - 1 >= 0 && possibleDir.push('left');
            emptyCellRow - 1 >= 0 && possibleDir.push('top');
            emptyCellCol + 1 < this.params.col && possibleDir.push('right');
            emptyCellRow + 1 < this.params.row && possibleDir.push('bottom');

            possibleDir = possibleDir.filter((v) => v !== oldDirection);

            const randomDirection = possibleDir[this.randomInt(0, possibleDir.length - 1)];
            // this.updateCell(emptyCellRow + 1, emptyCellCol), (oldDirection = 'bottom');

            if (randomDirection === 'left')
                this.updateCell(emptyCellRow, emptyCellCol - 1), (oldDirection = 'right');
            else if (randomDirection === 'top')
                this.updateCell(emptyCellRow - 1, emptyCellCol), (oldDirection = 'bottom');
            else if (randomDirection === 'right')
                this.updateCell(emptyCellRow, emptyCellCol + 1), (oldDirection = 'left');
            else if (randomDirection === 'bottom')
                this.updateCell(emptyCellRow + 1, emptyCellCol), (oldDirection = 'top');

            await wait();
        }
        this.isInShuffle = false;
        console.log(this.grid);
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

                    if (
                        this.isStarted &&
                        !this.isWin &&
                        this.isValidPosition(row, col, emptyCellRow, emptyCellCol)
                    ) {
                        console.log('VALID');
                        this.updateCell(row, col);
                        this.checkWin();
                        this.incRound();
                    }
                });
            });
        });
    };

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

// if (randomDirection === 'left') {
//     memo.push(`${emptyCellRow} ${emptyCellCol - 1}`);
//     this.updateCell(emptyCellRow, emptyCellCol - 1);
//     oldDirection = 'left';
// } else if (randomDirection === 'top') {
//     memo.push(`${emptyCellRow - 1} ${emptyCellCol}`);
//     this.updateCell(emptyCellRow - 1, emptyCellCol);
//     oldDirection = 'top';
// } else if (randomDirection === 'right') {
//     memo.push(`${emptyCellRow} ${emptyCellCol + 1}`);
//     this.updateCell(emptyCellRow, emptyCellCol + 1);
//     oldDirection = 'right';
// } else if (randomDirection === 'bottom') {
//     memo.push(`${emptyCellRow + 1} ${emptyCellCol}`);
//     this.updateCell(emptyCellRow + 1, emptyCellCol);
//     oldDirection = 'bottom';
// }
