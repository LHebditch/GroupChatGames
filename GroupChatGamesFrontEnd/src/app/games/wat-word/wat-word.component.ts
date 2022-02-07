import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { UsedKey } from './components/keyboard/keyboard.component';
import ACCEPTABLE_WORDS from './data/english-words.json';
import GameBoard, { GameBoardTile } from './models/game-board';
import { WordService } from './services/word.service';

enum GameStatus {
  WON,
  LOST,
  IN_PROGRESS
}

type GameState = {
  streak: number;
  gamesPlayed: number;
  gamesLost: number;
  guesses: string[];
  dateTS: number
  status: GameStatus;
  solution: string;
}

@Component({
  selector: 'gcg-wat-word',
  templateUrl: './wat-word.component.html',
  styleUrls: ['./wat-word.component.scss']
})
export class WatWordComponent implements OnInit {
  public word: string = '';
  public gameBoard: GameBoard;
  public usedKeys: { [key: string]: UsedKey } = {};
  public displayModal: boolean = false;
  public modalTitle: string = '';
  public state: GameState;

  private guesses: string[] = [];
  private lettersInGuess = 0;
  private currentGuess: string = '';
  private activeUsedKeys: { [key: string]: UsedKey } = {};
  private canPlay: boolean = true;
  private won: boolean = false;
  private stateKey = 'wordditch';

  constructor(private wordService: WordService, private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('Wordditch');
    this.metaService.addTag({ name: 'description', content: 'A wordle clone for my friends, away from NYT' });
  };

  async ngOnInit(): Promise<void> {
    this.fetchTodaysWord();
  }

  public closeModal() {
    this.displayModal = false;
  }

  public getGridRowStyles() {
    return {
      ...this.sharedGridStyles(),
      'grid-template-columns': `repeat(${this.word.length}, 1fr)`,
    };
  }

  public getGridStyles() {
    return {
      ...this.sharedGridStyles(),
      'grid-template-rows': `repeat(${this.word.length}, 1fr)`,
    };
  }

  public addCharacter(key: string) {
    if (this.lettersInGuess < this.word.length && this.canPlay) {
      this.currentGuess += key;
      this.gameBoard.addLetter(this.guesses.length, this.lettersInGuess, key);
      this.lettersInGuess++;
    }
  }

  public removeCharacter() {
    if (this.lettersInGuess > 0 && this.canPlay) {
      this.currentGuess = this.currentGuess.slice(0, this.currentGuess.length - 1);
      this.gameBoard.removeLetter(this.guesses.length, this.lettersInGuess - 1);
      this.lettersInGuess--;
    }
  }

  public async shareResult() {
    const state = this.getState();
    const output = this.gameBoard.getShareOutput(state.streak);
    const shareData: ShareData = { text: output };

    if (window.navigator.canShare(shareData)) {
      await window.navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(output);
    }
  }

  public makeGuess() {
    // TODO break out so we can reuse when populating on arefresh
    let usedKeys;
    if (this.currentGuess.length === this.word.length && this.wordIsValid() && this.canPlay) {
      this.canPlay = false;
      usedKeys = this.evaluateGuess(this.currentGuess); // guesses increased by 1
      this.gameBoard.commitRow(this.guesses.length - 1);

      if (this.currentGuess !== this.word) {
        // after we make a guess that's wrong we need to reset current guesses and move to next guess
        this.currentGuess = '';
        this.lettersInGuess = 0;
      }
      // update the state to record the guesses
      const state = this.getState();
      state.guesses = this.guesses;
      state.status = GameStatus.IN_PROGRESS;
      this.saveState(state);
    } else {
      this.gameBoard.failRow(this.guesses.length); // no guess has been added
    }
    this.activeUsedKeys = { ...this.usedKeys, ...usedKeys };
  }

  private evaluateGuess(guess: string): { [x: string]: UsedKey } {
    const usedKeys: { [x: string]: UsedKey } = {};

    const availableLettersInWord = this.word.split('');
    const matches: string[] = [];
    guess.split('').forEach((char, index) => {
      if (char === this.word[index]) {
        matches.push(char);
        this.gameBoard.markShared(this.guesses.length, index);
        usedKeys[char] = ({ ...usedKeys[char], match: true });
      }
    });
    matches.forEach(m => {
      availableLettersInWord.splice(availableLettersInWord.indexOf(m), 1)
    });

    for (let c = 0; c < guess.length; c++) {
      const letter: string = guess[c];
      const index = this.word.indexOf(letter);
      usedKeys[letter] = { ...usedKeys[letter], used: true }
      if (index > -1 && availableLettersInWord.includes(letter)) {
        this.gameBoard.markPresent(this.guesses.length, c);
        availableLettersInWord.splice(availableLettersInWord.indexOf(letter), 1)
        usedKeys[letter] = ({ ...usedKeys[letter], present: true });
      }
    }
    this.guesses.push(guess);
    return usedKeys;
  }

  private loadGameFromState() {
    const state = this.getState();
    // if this game as last played TODAY then reload from state
    if (this.datesMatch(new Date(), new Date(state.dateTS))) {
      this.won = state.status === GameStatus.WON;
      if (this.won) {
        this.canPlay = false;
        this.displayWin();
      }
      if (state.status === GameStatus.LOST) {
        this.canPlay = false;
        this.displayLoss();
      }

      this.gameBoard.setInitalState(this.gameBoardFromGuesses(state.guesses));
      this.usedKeys = state.guesses.reduce((guesses, value) => ({ ...guesses, ...this.evaluateGuess(value) }), {});
    }
  }

  private datesMatch(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  private gameBoardFromGuesses(guesses: string[]): GameBoardTile[][] {
    return guesses?.map(guess => this.gameBoardRowFromGuess(guess)) || [];
  }

  private gameBoardRowFromGuess(guess: string): GameBoardTile[] {
    const row: GameBoardTile[] = [];
    guess.split('').forEach((letter: string) => {
      const tile: GameBoardTile = { letter, isPresentInSolution: false, sharesLocation: false, commited: true, correct: false, fail: false }
      row.push(tile);
    });
    return row;
  }

  private postSubmit() {
    this.canPlay = true;
    this.usedKeys = this.activeUsedKeys;

    if (this.won) {
      this.displayWin();
    }

    if (this.currentGuess === this.word && !this.won) {
      this.win();
    }

    if (this.guesses.length === this.gameBoard.rows.length) {
      this.loose();
    }
  }

  private storeWin() {
    const state = this.getState();
    if (state.status === GameStatus.IN_PROGRESS) {
      state.streak += 1;
      state.gamesPlayed += 1;
      state.status = GameStatus.WON;
      this.saveState(state);
    }
  }

  private storeLoss() {
    const state = this.getState();
    if (state.status === GameStatus.IN_PROGRESS) {
      state.streak = 0;
      state.gamesPlayed += 1;
      state.gamesLost += 1;
      state.status = GameStatus.LOST;
      this.saveState(state);
    }
  }

  private displayWin() {
    this.getState();
    this.modalTitle = 'Congratulations!';
    this.displayModal = true;
  }

  private displayLoss() {
    this.getState();
    this.modalTitle = 'Better Luck Next Time!';
    this.displayModal = true;
  }

  private getState(): GameState {
    const stateString = window.localStorage.getItem(this.stateKey);
    let state;
    if (!!stateString) {
      state = JSON.parse(stateString) as GameState;
    } else {
      state = { solution: this.word, streak: 0, guesses: this.guesses, dateTS: Date.now(), gamesLost: 0, gamesPlayed: 0, status: GameStatus.IN_PROGRESS };
    }
    this.state = state;
    return state;
  }

  private saveState(state: GameState) {
    state.solution = this.word;
    state.dateTS = new Date().getTime();
    localStorage.setItem(this.stateKey, JSON.stringify(state));
  }

  private wordIsValid(): boolean {
    return ACCEPTABLE_WORDS.words.some(w => w === this.currentGuess);
  }

  private sharedGridStyles() {
    return {
      display: 'grid',
      'grid-gap': '5px'
    }
  }

  private fetchTodaysWord(): void {
    const state = this.getState();

    if (this.datesMatch(new Date(), new Date(state.dateTS)) && !!state.solution) {
      this.loadGame(state.solution);
    } else {
      this.wordService.getWord().subscribe(({ word }) => {
        this.loadGame(word);
        state.guesses = [];
        state.status = GameStatus.IN_PROGRESS;
        this.saveState(state);
      });
    }
  }

  private loadGame(word: string): void {
    this.word = word;
    this.gameBoard = new GameBoard(this.word.length);
    this.loadGameFromState();

    this.gameBoard.postSubmit.subscribe(() => this.postSubmit());
  }

  // trigger the win animation
  // displayWin is handled by post submit so we can wait for animation
  private win() {
    this.storeWin();
    this.canPlay = false;
    this.gameBoard.winRow(this.guesses.length - 1);
    this.won = true;
  }

  private loose() {
    this.storeLoss();
    this.canPlay = false;
    this.displayLoss();
  }
}
