import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SlicePipe} from '@angular/common';
import {WalletService} from '../../services/wallet.service';
import {ToastrService} from 'ngx-toastr';

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
export class NavbarComponent implements OnInit {
  walletConnected = false;
  walletAddress: string | null = null;
  #walletService: WalletService = inject(WalletService);
  #toastrService: ToastrService = inject(ToastrService);

  ngOnInit() {
    if(sessionStorage.getItem('wallet-address')) {
      this.walletAddress = sessionStorage.getItem('wallet-address');
      this.walletConnected = true;
      this.#toastrService.success('Wallet address connected!', 'Success');
    }
  }

  async connectWallet() {
    this.walletAddress = await this.#walletService.connectWallet();
    sessionStorage.setItem('wallet-address', this.walletAddress);
    this.walletConnected = true;
    this.#toastrService.success('Wallet address connected!', 'Success');
  }

  disconnectWallet() {
    this.walletConnected = false;
    this.walletAddress = null;
    sessionStorage.removeItem('wallet-address');
    this.#toastrService.success('Wallet address disconnected!', 'Success');
  }

  copyWalletAddress() {
    navigator.clipboard.writeText(this.walletAddress || '');
    this.#toastrService.success('Wallet address copied to clipboard!', 'Success');
  }
}
