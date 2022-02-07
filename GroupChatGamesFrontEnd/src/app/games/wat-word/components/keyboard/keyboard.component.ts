import { EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

enum SpecialKeys {
  BACK = 'back',
  ENTER = 'enter'
}

type Key = {
  val: string;
  isSpecial: boolean;
  icon: string;
  used?: boolean;
  present?: boolean;
  match?: boolean;
}

export type UsedKey = {
  present: boolean;
  match: boolean;
  used: boolean;
}

@Component({
  selector: 'gcg-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit, OnChanges {

  @Output("onBackspacePress") onBackspacePress: EventEmitter<void> = new EventEmitter();
  @Output("onEnterPress") onEnterPress: EventEmitter<void> = new EventEmitter();
  @Output("onLetterPress") onLetterPress: EventEmitter<string> = new EventEmitter();

  @Input('usedKeys') usedKeys: { [key: string]: UsedKey };

  public keyBoardDef: Key[][] = []
  private keyboardKeys: (string[] | SpecialKeys[])[] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    [SpecialKeys.ENTER, 'z', 'x', 'c', 'v', 'b', 'n', 'm', SpecialKeys.BACK]
  ];

  ngOnInit(): void {
    this.generateKeyboardDef();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const current = changes['usedKeys'].currentValue;
    if (current != changes['usedKeys'].previousValue) {
      Object.keys(current).forEach(key => {
        this.updateKeyState(key, current[key]);
      });
    }
  }

  public keyPress(key: string): void {
    if (key === SpecialKeys.BACK) {
      this.backspacePress();
    } else if (key === SpecialKeys.ENTER) {
      this.enterPress();
    } else {
      this.onLetterPress.emit(key);
    }
  }

  private backspacePress(): void {
    this.onBackspacePress.emit();
  }

  private enterPress(): void {
    this.onEnterPress.emit();
  }

  private generateKeyboardDef(): void {
    if (this.keyBoardDef.length) return;
    for (let row of this.keyboardKeys) {
      const defRow: Key[] = []
      for (let key of row) {
        const isSpecial = key === SpecialKeys.ENTER || key === SpecialKeys.BACK;
        const icon = this.getKeyIcon(key);
        defRow.push({ val: key, isSpecial, icon });
      }
      this.keyBoardDef.push(defRow);
    }
  }

  private getKeyIcon(key: string): string {
    const icons: { [key: string]: string } = {
      back: 'delete',
      enter: 'play'
    };

    return icons[key] || '';
  }

  private updateKeyState(key: string, state: UsedKey) {
    if (!this.keyBoardDef.length) {
      this.generateKeyboardDef();
    }
    this.keyBoardDef.forEach(row => {
      row.forEach(k => {
        if (k.val === key) {
          k.used = state.used;
          k.present = state.present;
          k.match = state.match;
        }
      })
    })
  }
}
