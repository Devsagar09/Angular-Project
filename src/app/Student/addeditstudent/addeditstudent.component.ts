import { Component } from '@angular/core';

@Component({
  selector: 'app-addeditstudent',
  standalone: false,
  templateUrl: './addeditstudent.component.html',
  styleUrls: ['./addeditstudent.component.css'],
})
export class AddeditstudentComponent {
  showField: boolean = false;
  buttonText: string = 'SHOW MORE';
  activeTab: string = 'personInfo';
  completedTabs: string[] = [];

  setActiveTab(tab: string) {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

    // Ensure completion order (Only previous tab should be completed)
    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);

    if (
      nextIndex > currentIndex &&
      !this.completedTabs.includes(this.activeTab)
    ) {
      this.completedTabs.push(this.activeTab);
    }

    if (nextIndex < currentIndex) {
      // Reset completed state of tabs that come after the previous tab
      const resetTabs = tabOrder.slice(nextIndex + 1);
      resetTabs.forEach((tab) => {
        const index = this.completedTabs.indexOf(tab);
        if (index > -1) {
          this.completedTabs.splice(index, 1);
        }
      });
    }

    this.activeTab = tab;
  }
  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  isCompleted(tab: string): boolean {
    return this.completedTabs.includes(tab);
  }

  toggleMoreField() {
    this.showField = !this.showField;
    this.buttonText = this.showField ? 'SHOW LESS' : 'SHOW MORE'; // Update button text
  }

}
