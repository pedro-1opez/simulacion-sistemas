document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll(".chess-board td");
    const boardSize = 8;
    let queenIcon = "images/queen.png";

    const solutions = [
        [[0, 0], [1, 2], [2, 4], [3, 6], [4, 1], [5, 3], [6, 5], [7, 7]],
        [[0, 1], [1, 3], [2, 5], [3, 7], [4, 0], [5, 2], [6, 4], [7, 6]],
        [[0, 2], [1, 4], [2, 6], [3, 1], [4, 3], [5, 5], [6, 7], [7, 0]],
        [[0, 3], [1, 5], [2, 7], [3, 0], [4, 2], [5, 4], [6, 6], [7, 1]],
        [[0, 4], [1, 6], [2, 1], [3, 3], [4, 5], [5, 7], [6, 0], [7, 2]],
        [[0, 5], [1, 7], [2, 0], [3, 2], [4, 4], [5, 6], [6, 1], [7, 3]]
    ];

    const resetButton = document.getElementById("reset-selects-btn");

    document.getElementById("queen-icon-select").addEventListener("change", function() {
        queenIcon = this.value;
        updateQueenIcons();
        enableResetButton();
    });

    document.getElementById("solution-select").addEventListener("change", function() {
        const solutionIndex = this.value;
        applySolution(solutions[solutionIndex]);
        enableResetButton();
    });

    document.getElementById("cell-color-select1").addEventListener("change", function() {
        updateCellColors();
        enableResetButton();
    });

    document.getElementById("cell-color-select2").addEventListener("change", function() {
        updateCellColors();
        enableResetButton();
    });

    document.getElementById("clear-board-btn").addEventListener("click", function() {
        clearBoard();
    });

    resetButton.addEventListener("click", function() {
        resetSelects();
        resetButton.disabled = true;
    });

    cells.forEach(cell => {
        cell.addEventListener("click", function() {
            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;

            if (cell.querySelector("img.queen")) {
                // If there is a queen image, we remove it and  we unblock cells
                cell.innerHTML = "";
                unblockCells();
            } else if (!cell.querySelector("img.blocked")) {
                // If there is no queen image and no blocked image, we add the queen image and block the cells
                const img = document.createElement("img");
                img.src = queenIcon;
                img.alt = "queen";
                img.classList.add("queen");
                img.style.width = "100%";
                img.style.height = "100%";
                cell.appendChild(img);
                blockCells();
            }
        });
    });

    function updateQueenIcons() {
        const queens = document.querySelectorAll(".chess-board img.queen");
        queens.forEach(queen => {
            queen.src = queenIcon;
        });
    }

    function applySolution(solution) {
        clearBoard();
        solution.forEach(position => {
            const row = position[0];
            const col = position[1];
            const cell = document.querySelector(`.chess-board tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
            const img = document.createElement("img");
            img.src = queenIcon;
            img.alt = "queen";
            img.classList.add("queen");
            img.style.width = "100%";
            img.style.height = "100%";
            cell.appendChild(img);
        });
        blockCells();
    }

    function clearBoard() {
        cells.forEach(cell => {
            cell.innerHTML = "";
        });
    }

    function blockCells() {
        clearBlockedCells();
        const queens = document.querySelectorAll(".chess-board img.queen");
        queens.forEach(queen => {
            const row = queen.parentElement.parentElement.rowIndex;
            const col = queen.parentElement.cellIndex;
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (i === row || j === col || Math.abs(i - row) === Math.abs(j - col)) {
                        const cell = document.querySelector(`.chess-board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
                        if (!cell.querySelector("img.queen") && !cell.querySelector("img.blocked")) {
                            const img = document.createElement("img");
                            img.src = "images/red-x.png";
                            img.alt = "blocked";
                            img.classList.add("blocked");
                            img.style.width = "100%";
                            img.style.height = "100%";
                            cell.appendChild(img);
                        }
                    }
                }
            }
        });
    }

    function unblockCells() {
        clearBlockedCells();
        blockCells();
    }

    function clearBlockedCells() {
        const blockedCells = document.querySelectorAll(".chess-board img.blocked");
        blockedCells.forEach(blockedImg => {
            blockedImg.parentElement.removeChild(blockedImg);
        });
    }

    function updateCellColors() {
        const color1 = document.getElementById("cell-color-select1").value;
        const color2 = document.getElementById("cell-color-select2").value;
        const chessBoard = document.querySelector(".chess-board");

        chessBoard.querySelectorAll("tr").forEach((row, rowIndex) => {
            row.querySelectorAll("td").forEach((cell, cellIndex) => {
                if ((rowIndex + cellIndex) % 2 === 0) {
                    cell.style.backgroundColor = color1;
                } else {
                    cell.style.backgroundColor = color2;
                }
            });
        });
    }

    function resetSelects() {
        document.getElementById("queen-icon-select").selectedIndex = 0;
        document.getElementById("solution-select").selectedIndex = 0;
        document.getElementById("cell-color-select1").selectedIndex = 0;
        document.getElementById("cell-color-select2").selectedIndex = 0;
        queenIcon = "images/queen.png";
        clearBoard();
        updateCellColors();
    }

    function enableResetButton() {
        resetButton.disabled = false;
    }
});