import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { GameState } from '../../model/game-state';
import { ShareService } from '../services/share.service';
import { StateService } from '../services/state.service';
import { CodeBreakerGameBoardComponent } from './game-board/game-board.component';
import { WordsService } from './services/words.service';


type HackitchState = {
  solution: string;
  clutter: string[];
  dateTs: number;
  attemptsLeft: number;
  guesses: string[];
  streak: number;
  status: GameState;
}

@Component({
  selector: 'gcg-code-breaker',
  templateUrl: './code-breaker.component.html',
  styleUrls: ['./code-breaker.component.scss']
})
export class CodeBreakerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CodeBreakerGameBoardComponent) gameBoard: CodeBreakerGameBoardComponent;

  public word: string;
  public wordClutter: string[];
  public lives: number[] = [1, 2, 3, 4, 5];
  public consoleEntries: string[] = [];

  private canPlay = true;
  private guesses: string[] = [];
  private stateKey: string = 'hackitch';

  constructor(@Inject(DOCUMENT) private document: Document, private wordsService: WordsService, private stateService: StateService,
    private shareService: ShareService) {
    this.document.body.classList.add('pitch-black');
  }

  ngAfterViewInit(): void {
    this.fetchWords();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('pitch-black');
  }

  public onGuess(wordGuessed: string) {
    if (this.lives.length > 0 && this.canPlay) {
      this.guesses.push(wordGuessed);
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
      this.saveState();
    }
  }

  public share() {
    const state = this.getState();
    const lifeIcon = '🟩';
    const today = new Date()
    let output = `Hackitch ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}\n`;
    for (let guess of this.guesses) {
      const likeness = this.evaluateLikeness(guess);
      if (likeness != this.word.length) {
        output += `${likeness}\n`
      }
    }
    output += this.lives.map(_ => lifeIcon).join(' ');
    output += `\nCurrent Streak: ${state.streak}`;
    this.shareService.shareResult(output);
  }

  private saveState(stateToSave: (HackitchState | null) = null) {
    const state = stateToSave || this.getState();
    state.dateTs = new Date().getTime();
    state.guesses = this.guesses;
    state.attemptsLeft = this.lives.length;
    state.solution = this.word;
    state.clutter = this.wordClutter;
    this.stateService.saveState<HackitchState>(state, this.stateKey);
  }

  private getState(): HackitchState {
    return this.stateService.getState<HackitchState>(this.stateKey) || this.defaultState();
  }

  private fetchWords() {
    const state = this.getState();
    if (this.stateService.datesMatch(new Date(), new Date(state.dateTs)) && !!state.solution) {
      this.loadGame(state.solution, state.clutter);
      setTimeout(() => {
        this.loadState(state);
      }, 0);
    } else {
      this.wordsService.getWords()
        .subscribe(res => {
          const { solution, clutter } = res;
          state.status = GameState.IN_PROGRESS;
          this.saveState(state);
          this.loadGame(solution, clutter);
        })
    }
  }

  private loadState(state: HackitchState) {
    state.guesses.forEach(g => {
      const index = this.gameBoard.wordIndex(g);
      this.gameBoard.makeGuess(index, true);
    });
  }

  private loadGame(solution: string, clutter: string[]) {
    this.word = solution;
    this.wordClutter = clutter;
    this.gameBoard.buildGame(solution, clutter);
    this.saveState();
  }

  private defaultState(): HackitchState {
    return {
      dateTs: new Date().setMonth(-12),
      solution: '',
      clutter: [],
      guesses: [],
      attemptsLeft: 5,
      streak: 0,
      status: GameState.IN_PROGRESS
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
    const state = this.getState();
    if (state.status == GameState.IN_PROGRESS) {
      state.streak = (state.streak || 0) + 1;
      state.status = GameState.WIN;
      this.saveState(state);
    }
    this.canPlay = false;
    this.gameBoard.displayWin();
  }

  private loose() {
    const state = this.getState();
    if (state.status == GameState.IN_PROGRESS) {
      state.streak = 0;
      state.status = GameState.LOSS;
      this.saveState(state);
      this.canPlay = false;
    }
    this.gameBoard.displayLoss();
  }

}
