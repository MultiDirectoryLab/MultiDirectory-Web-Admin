import { Component } from '@angular/core';

@Component({
  selector: 'app-download-data',
  template: ``,
  standalone: true,
})
export class DownloadComponent {
  downloadDict(data: any, name: string) {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    // Step 6: Clean up the URL object
    URL.revokeObjectURL(link.href);
  }
}
