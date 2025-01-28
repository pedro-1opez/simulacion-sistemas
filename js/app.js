document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll(".chess-board td");
    const boardSize = 8;
    let queenIcon = "images/queen.png";
    let blockedColor = "#ff0000";

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

    document.getElementById("cell-color-chooser1").addEventListener("change", function() {
        updateCellColors();
        enableResetButton();
    });

    document.getElementById("cell-color-chooser2").addEventListener("change", function() {
        updateCellColors();
        enableResetButton();
    });

    document.getElementById("cell-color-chooser-blocked").addEventListener("change", function() {
        blockedColor = this.value;
        document.documentElement.style.setProperty('--blocked-color', blockedColor); // Actualiza la variable CSS
        updateBlockedCells();
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
                // If there is a queen image, remove it and unblock cells
                cell.innerHTML = "";
                unblockCells();
            } else if (!cell.classList.contains("blocked")) {
                // If there is no queen image and no blocked cell, add the queen image and block cells
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

        cell.addEventListener("mouseover", function() {
            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;
            highlightAttackCells(row, col);
        });

        cell.addEventListener("mouseout", function() {
            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;
            unhighlightAttackCells(row, col);
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
        blockCells(); // Call blockCells to update blocked cells after applying the solution
    }

    function clearBoard() {
        cells.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove("blocked");
            cell.classList.remove("custom-blocked");
            cell.style.backgroundColor = ""; // Reset background color
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
                        if (!cell.querySelector("img.queen") && !cell.classList.contains("blocked")) {
                            cell.classList.add("blocked");
                            cell.classList.add("custom-blocked"); // Añade la clase personalizada
                            cell.style.backgroundColor = blockedColor; // Set blocked color
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
        const blockedCells = document.querySelectorAll(".chess-board td.blocked");
        blockedCells.forEach(blockedCell => {
            blockedCell.classList.remove("blocked");
            blockedCell.classList.remove("custom-blocked");
            blockedCell.style.backgroundColor = ""; // Reset background color
        });
    }

    function updateCellColors() {
        const color1 = document.getElementById("cell-color-chooser1").value;
        const color2 = document.getElementById("cell-color-chooser2").value;
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

    function updateBlockedCells() {
        const blockedCells = document.querySelectorAll(".chess-board td.blocked");
        blockedCells.forEach(blockedCell => {
            blockedCell.style.backgroundColor = blockedColor; // Update blocked color
        });
    }

    function resetSelects() {
        document.getElementById("queen-icon-select").selectedIndex = 0;
        document.getElementById("solution-select").selectedIndex = 0;
        document.getElementById("cell-color-chooser1").value = "#d49f67";
        document.getElementById("cell-color-chooser2").value = "#52311e";
        document.getElementById("cell-color-chooser-blocked").value = "#ff0000";
        queenIcon = "images/queen.png"; // Reset the queen icon to the default
        blockedColor = "#ff0000"; // Reset blocked color to default
        document.documentElement.style.setProperty('--blocked-color', blockedColor); // Reset variable CSS
        clearBoard();
        updateCellColors();
    }

    function enableResetButton() {
        resetButton.disabled = false;
    }

    function highlightAttackCells(row, col) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (i === row || j === col || Math.abs(i - row) === Math.abs(j - col)) {
                    const cell = document.querySelector(`.chess-board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
                    cell.classList.add("highlight");
                }
            }
        }
    }

    function unhighlightAttackCells(row, col) {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (i === row || j === col || Math.abs(i - row) === Math.abs(j - col)) {
                    const cell = document.querySelector(`.chess-board tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
                    cell.classList.remove("highlight");
                }
            }
        }
    }
});