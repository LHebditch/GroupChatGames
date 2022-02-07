import { EventEmitter } from "@angular/core";
import { interval, share, Subject, takeUntil } from "rxjs";

export type GameBoardTile = {
    letter: string;
    isPresentInSolution: boolean;
    sharesLocation: boolean;
    commited: boolean;
    correct: boolean;
    fail: boolean;
}

export default class GameBoard {
    rows: GameBoardTile[][];

    public postSubmit: EventEmitter<void> = new EventEmitter();

    constructor(length: number) {
        this.rows = [];
        for (let i = 0; i < length + 1; i++) {
            const row: GameBoardTile[] = [];
            for (let j = 0; j < length; j++) {
                row.push({
                    letter: '',
                    isPresentInSolution: false,
                    sharesLocation: false,
                    commited: false,
                    correct: false,
                    fail: false
                });
            }
            this.rows.push(row);
        }
    }

    public addLetter(row: number, col: number, letter: string) {
        this.rows[row][col].letter = letter
    }

    public removeLetter(row: number, col: number) {
        this.rows[row][col].letter = '';
    }

    public markPresent(row: number, col: number) {
        if (row >= this.rows.length) return;
        this.rows[row][col].isPresentInSolution = true;
    }

    public markShared(row: number, col: number) {
        if (row >= this.rows.length) return;
        this.rows[row][col].sharesLocation = true;
    }

    public commitRow(row: number) {
        this.applyToRowWithDelay(250, column => {
            this.rows[row][column].commited = true;
        });
    }

    public winRow(row: number) {
        this.applyToRowWithDelay(150, column => {
            this.rows[row][column].correct = true;
        });
    }

    public applyToRowWithDelay(speed: number, action: (column: number) => void) {
        let column = 0;
        const $finish = new Subject();
        interval(speed)
            .pipe(
                takeUntil($finish)
            )
            .subscribe(() => {
                if (column >= this.rows[0].length) {
                    this.postSubmit.emit();
                    $finish.next(null);
                } else {
                    action(column)
                    column++;
                }
            });
    }

    public setInitalState(state: GameBoardTile[][]) {
        state.forEach((v: GameBoardTile[], i: number) => {
            v.forEach((t: GameBoardTile, j: number) => {
                this.rows[i][j] = t;
            });
        });
    }

    public getShareOutput(streak: number): string {
        const shareIcons = { present: '🟨', used: '⬜', match: '🟩' };
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        let output: string = `Wordditch ${day}/${month}/${year}\n`;
        this.rows.forEach(r => {
            r.forEach(l => {
                if (!!l.letter) {
                    output += l.sharesLocation ? shareIcons.match : l.isPresentInSolution ? shareIcons.present : shareIcons.used;
                }
            })
            output += this.getRowWord(r) ? '\n' : '';
        });

        return `${output}\nCurrent Streak: ${streak}`;
    }

    private getRowWord(row: GameBoardTile[]): string {
        return row.reduce((word, r) => word + r.letter, '');
    }

    public failRow(rowIndex: number) {
        this.rows[rowIndex].forEach(r => {
            // if the user keeps pressng it then repeat
            r.fail = false;
            setTimeout(() => {
                r.fail = true
            }, 1);
        });
        // setTimeout(() => {
        //     this.rows[rowIndex].forEach(r => r.fail = false);
        // }, 1000);
    }
}
