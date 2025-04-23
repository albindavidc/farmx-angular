import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-message-input',
  imports: [MatIcon],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent implements AfterViewInit {
  @ViewChild('autoResizeTextarea') textareaEl!: ElementRef;

  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }

  onTextareaInput() {
    this.adjustTextareaHeight();
  }

  private adjustTextareaHeight() {
    const textarea = this.textareaEl.nativeElement;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 80);
    textarea.style.height = newHeight + 'px';
  }
}
