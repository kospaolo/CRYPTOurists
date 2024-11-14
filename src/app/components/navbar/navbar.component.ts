import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {SlicePipe} from '@angular/common';
import {WalletService} from '../../services/wallet.service';
import {ToastrService} from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';
import {adminAddresses, businessAddresses} from '../../utils/constants';
import { DeployContractModalComponent } from '../deploy-contract-modal/deploy-contract-modal.component';
import { ContractService } from '../../services/contract.service';
import { MatDialog } from '@angular/material/dialog';

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
    RouterLink,
    DeployContractModalComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  #walletService: WalletService = inject(WalletService);
  #toastrService: ToastrService = inject(ToastrService);
  #router: Router               = inject(Router);
  #dialog = inject(MatDialog);
  #contractService = inject(ContractService);
  walletAddress: string | null = null;
  walletConnected = false;
  isAdmin: boolean          = false;
  isBusiness: boolean       = false;
  isArticlesPage: boolean   = false;

  ngOnInit() {
    this.isArticlesPage = this.#router.url === '/articles';

    this.#router.events.subscribe(() => {
      this.isArticlesPage = this.#router.url === '/articles';
    });

    const walletAddress = sessionStorage.getItem('wallet-address');

    if(walletAddress) {
      this.isAdmin = adminAddresses
        .map(address => address.toLowerCase())
        .includes(walletAddress.toLowerCase());
      const normalizedWalletAddress = walletAddress?.toLowerCase();
      const normalizedBusinessAddresses = businessAddresses.map(address => address.toLowerCase());
      this.isBusiness = normalizedBusinessAddresses.includes(normalizedWalletAddress);
      this.walletAddress = walletAddress;
      this.walletConnected = true;
      this.#toastrService.success('Wallet address connected!', 'Success');
    }
  }

  async connectWallet() {
    this.walletAddress = await this.#walletService.connectWallet();
    sessionStorage.setItem('wallet-address', this.walletAddress);
    this.walletConnected = true;
    this.#toastrService.success('Wallet address connected!', 'Success');
    window.location.reload();
  }

  disconnectWallet() {
    this.walletConnected = false;
    this.walletAddress = null;
    sessionStorage.removeItem('wallet-address');
    this.#toastrService.success('Wallet address disconnected!', 'Success');
    window.location.reload();
  }

  copyWalletAddress() {
    navigator.clipboard.writeText(this.walletAddress || '');
    this.#toastrService.success('Wallet address copied to clipboard!', 'Success');
  }

  async openDeployContractModal() {
    const dialogRef = this.#dialog.open(DeployContractModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (operatorFee: number) => {
      if (operatorFee !== undefined) {
        try {
          const address = await this.#contractService.deployContract(operatorFee);
          this.#toastrService.success('Contract deployed successfully!', 'Success');
          window.location.reload();
        } catch (error) {
          this.#toastrService.error('Failed to deploy contract', 'Error');
        }
      }
    });
  }

  get contractAddressExists(): boolean {
    return !!localStorage.getItem('contract-address');
  }
}
