import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { CodeBreakerGameBoardComponent } from './game-board/game-board.component';

@Component({
  selector: 'gcg-code-breaker',
  templateUrl: './code-breaker.component.html',
  styleUrls: ['./code-breaker.component.scss']
})
export class CodeBreakerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CodeBreakerGameBoardComponent) gameBoard: CodeBreakerGameBoardComponent;

  public word = 'shot';
  public wordClutter = [
    'seen',
    'food',
    'once',
    'path',
    'soak',
    'beat',
    'slat',
    'grow',
    'loan',
    'ship'
  ];
  public lives: number[] = [1, 2, 3, 4, 5];
  public consoleEntries: string[] = [];

  private canPlay = true;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.body.classList.add('pitch-black');
  }

  ngAfterViewInit(): void {
    this.gameBoard.buildGame(this.word, this.wordClutter);
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('pitch-black');
  }

  public onGuess(wordGuessed: string) {
    if (this.lives.length > 0 && this.canPlay) {
      if (wordGuessed.toLowerCase() === this.word.toLowerCase()) {
        this.win();
      } else {
        const likeness = this.evaluateLikeness(wordGuessed);

        this.consoleEntries = [`> ${wordGuessed.toUpperCase()}: Likeness: ${likeness}`, ...this.consoleEntries];
        this.lives.splice(0, 1);
        if (this.lives.length == 0) {
          this.loose();
        }
      }
    }
  }

  private evaluateLikeness(wordGuessed: string): number {
    let likeness = 0;
    for (let char = 0; char < wordGuessed.length; char++) {
      if (this.word[char] === wordGuessed[char]) {
        likeness += 1;
      }
    }
    return likeness;
  }

  private win() {
    this.canPlay = false;
    this.gameBoard.displayWin();
  }

  private loose() {
    this.canPlay = false;
    this.gameBoard.displayLoss();
  }

}
