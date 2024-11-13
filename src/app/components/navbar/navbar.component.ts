import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SlicePipe} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    SlicePipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  walletConnected = false;
  walletAddress: string | null = null;

  connectWallet() {
    // Replace this with actual wallet connection logic
    this.walletConnected = true;
    this.walletAddress = '0x1234...abcd'; // Example wallet address
  }

  disconnectWallet() {
    this.walletConnected = false;
    this.walletAddress = null;
  }

  copyWalletAddress() {
    navigator.clipboard.writeText(this.walletAddress || '');
  }
}
