import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();
  
  private searchSubject = new Subject<string>();
  
  constructor() {
    // Kullanıcı yazmayı bitirdikten 300ms sonra aramayı tetikle
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
    });
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm.toLowerCase().trim());
  }

  clearSearch(searchInput: HTMLInputElement) {
    searchInput.value = '';
    this.searchSubject.next('');
  }
}