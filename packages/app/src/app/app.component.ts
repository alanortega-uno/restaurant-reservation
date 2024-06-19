import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'restaurant-reservation';
  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.listen('message').subscribe((data: any) => {
      console.log(data);
    });
  }

  sendMessage() {
    this.socketService.emit('message', 'Hello from Angular');
  }
}
