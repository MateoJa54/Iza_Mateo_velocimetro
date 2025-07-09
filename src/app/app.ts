import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent }    from './shared/header/header';
import { FooterComponent }    from './shared/footer/footer';
import { HomeComponent } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,FooterComponent, HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected title = 'IzaMateo2Ex';
}
