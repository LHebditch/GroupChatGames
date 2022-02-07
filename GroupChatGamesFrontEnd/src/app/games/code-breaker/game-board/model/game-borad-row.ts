import { interval, Subject, takeUntil } from "rxjs";

class GameBoardCharacter {
    char: string;
    isWord: boolean;
    shown: boolean;
}

export class GameBoardRow {
    public row: GameBoardCharacter[];
    public word: string;
    public focussed: boolean = false;
    public guessed: boolean = false;

    private specialCharacters = [
        '}', '{', '[', ']', '@', '#', '!', '$', '?', '"', '>', '<', ':', ',',
        '/', '\\', '+', '-', '=', '*', '£', '%', '%', '^', '|', '_', '-', '.'
    ];

    constructor(word: string, length: number) {
        this.word = word;
        const fillLength = length - word.length;
        const prefixSize = Math.round(Math.random() * fillLength);
        const suffixSize = fillLength - prefixSize;

        const shown = false;
        const wordChars: GameBoardCharacter[] = word.split('').map(c => ({ char: c, isWord: true, shown }));
        const prefix: GameBoardCharacter[] = this.generateSpecials(prefixSize).split('').map(c => ({ char: c, isWord: false, shown }));
        const suffix: GameBoardCharacter[] = this.generateSpecials(suffixSize).split('').map(c => ({ char: c, isWord: false, shown }));
        this.row = [...prefix, ...wordChars, ...suffix];
    }

    private generateSpecials(count: number): string {
        let specialString = '';
        for (let i = 0; i < count; i++) {
            specialString += this.randomSpecial()
        }

        return specialString;
    }

    public typeOut() {
        const $complete = new Subject();
        interval(75)
            .pipe(
                takeUntil($complete)
            )
            .subscribe(i => {
                if (i < this.row.length) {
                    this.row[i].shown = true;
                } else {
                    $complete.next(null);
                }
            });

    }

    private randomSpecial(): string {
        const randomIndex = Math.round(Math.random() * (this.specialCharacters.length - 1));
        return this.specialCharacters[randomIndex];
    }
}
