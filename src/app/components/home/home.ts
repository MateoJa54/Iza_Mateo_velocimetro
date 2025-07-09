// src/app/home.component.ts  (o src/app/home.ts)
// —
import { Component, signal, computed } from '@angular/core';
import { CommonModule }                     from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule    // <<–– aquí traes NgClass, NgIf, etc.
  ],
  templateUrl: './home.html',
  styleUrls:   ['./home.css']
})
export class HomeComponent {
  speed = signal(0);

  acelerar() { this.speed.update(v => v + 5); }
  frenar()   { this.speed.update(v => Math.max(0, v - 3)); }
  reiniciar(){ this.speed.set(0); }

  speedClass = computed(() => {
    const v = this.speed();
    if (v <= 30)   return 'low-speed';
    if (v <= 70)   return 'medium-speed';
    if (v <= 120)  return 'high-speed';
    return 'danger-speed';
  });
}
