import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private window: Window;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView as Window;
  }

  public async shareResult(output: string) {
    const shareData: ShareData = { text: output };
    const win = this.window;

    if (win.navigator.canShare && win.navigator.canShare(shareData)) {
      await win.navigator.share(shareData);
    } else if (win.navigator.clipboard) {
      win.navigator.clipboard.writeText(output);
    } else {
      alert('Sharing is not supported by this device, sorry.')
    }
  }
}
