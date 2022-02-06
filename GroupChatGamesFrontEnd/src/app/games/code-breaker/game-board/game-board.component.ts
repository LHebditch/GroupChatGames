import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { interval } from 'rxjs';
import { GameBoardRow } from './model/game-borad-row';

@Component({
  selector: 'gcg-code-breaker-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class CodeBreakerGameBoardComponent {
  @Output('guess') guess: EventEmitter<string> = new EventEmitter<string>();
  public word: string;
  public gameBoard: GameBoardRow[];
  public playing = true;
  public completionHeader: string;
  public completionSubHeader: string;

  private columnWidth = 25;
  private rowCount = 16;

  constructor() { }

  public buildGame(word: string, wordClutter: string[]) {
    this.word = word;
    // make the columns word count differ by as much as three
    const allWords = [word, ...wordClutter];
    const board = this.buildColumn(this.randomSort(allWords));
    setTimeout(() => {
      this.displayGame(board);
    }, 0);
  }

  public displayWin() {
    this.playing = false;
    this.completionHeader = 'Congratulations!';
    this.completionSubHeader = 'You found today\'s codeword!'
  }

  public displayLoss() {
    this.playing = false;
    this.completionHeader = 'Better Luck Next Time';
    this.completionSubHeader = 'You were unable to crack the code today.'
  }

  public unfocusRow(rowIndex: number, isWord: boolean) {
    if (isWord) {
      this.gameBoard[rowIndex].focussed = false;
    }
  }

  public focusRow(rowIndex: number, isWord: boolean) {
    if (isWord) {
      this.gameBoard[rowIndex].focussed = true;
    }
  }

  public makeGuess(rowIndex: number, isWord: boolean) {
    if (isWord) {
      const wordGuessed = this.gameBoard[rowIndex].word;
      this.guess.emit(`${wordGuessed}`);
    }
  }

  private displayGame(board: GameBoardRow[]): void {
    this.gameBoard = board;
    for (let row of this.gameBoard) {
      row.typeOut();
    }
  }

  /**
   * Build a column with ${rowCount} rows where all given words appear in random rows
   * @param words array of words to include in column
   */
  private buildColumn(words: string[]): GameBoardRow[] {
    const rowsUsed: number[] = [-1];
    const columns = [];
    for (let w = 0; w < words.length; w++) {
      let rowToReside: number = -1;
      while (rowsUsed.includes(rowToReside)) {
        rowToReside = Math.round(Math.random() * (this.rowCount - 1)); // 0 - (rowcount -1)
      }
      rowsUsed.push(rowToReside);
    }

    for (let r = 0; r < this.rowCount; r++) {
      const word = rowsUsed.includes(r) ? words.splice(0, 1)[0] : '';
      columns.push(new GameBoardRow(word, this.columnWidth));
    }
    return columns;
  }

  private randomSort(wordArray: string[]): string[] {
    return wordArray.sort(() => Math.random() - Math.random());
  }

}
