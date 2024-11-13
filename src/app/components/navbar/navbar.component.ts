import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SlicePipe} from '@angular/common';
import {WalletService} from '../../services/wallet.service';
import {ToastrService} from 'ngx-toastr';
import {RouterLink} from '@angular/router';

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
    SlicePipe,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  #walletService: WalletService = inject(WalletService);
  #toastrService: ToastrService = inject(ToastrService);
  walletConnected = false;
  walletAddress: string | null = null;
  isAdmin: boolean = false;

  constructor() {
    const adminAddresses = ['0xc09CD05e58aB5Bd8862DEe3f44e6ddAd5567F091']
    const walletAddress = sessionStorage.getItem('wallet-address');
    if(walletAddress) {
      this.isAdmin = adminAddresses
        .map(address => address.toLowerCase())
        .includes(walletAddress.toLowerCase());
    }
  }

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
