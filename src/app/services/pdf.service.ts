// pinata.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import axios from 'axios';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class PinataService {
  private apiKey = 'YOUR_API_KEY';
  private apiSecret = 'YOUR_API_SECRET';

  private contractAddress = 'YOUR_CONTRACT_ADDRESS'; // After deployment
  private contractABI = [
    "function storePDF(string memory _ipfsHash, string memory _name) public",
    "function getPDFCount() public view returns (uint256)",
    "function getPDF(uint256 _index) public view returns (string memory, uint256, string memory)"
  ];

  private baseURL = 'https://api.pinata.cloud';

  constructor() {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'pinata_api_key': this.PINATA_API_KEY,
      'pinata_secret_api_key': this.PINATA_SECRET_KEY
    });
  }

  uploadPDF(file: File): Observable<any> {
    return from(this.uploadToIPFS(file));
  }

  generatePDF(data: any): File {
    const doc = new jsPDF();

    // Add content to PDF
    doc.setFontSize(16);
    doc.text('Generated Document', 20, 20);

    // Add data to PDF
    doc.setFontSize(12);
    let yPosition = 40;

    // Example: Add each property from data object
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPosition);
      yPosition += 10;
    });

    // Get the PDF as blob
    const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });

    // Create a File object
    return new File([pdfBlob], 'generated-document.pdf', { type: 'application/pdf' });
  }

  async uploadToPinata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'pdf',
        uploadDate: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'pinata_api_key': this.PINATA_API_KEY,
            'pinata_secret_api_key': this.PINATA_SECRET_KEY,
            'Content-Type': `multipart/form-data;`
          }
        }
      );

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        gatewayURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateAndUpload(data: any): Observable<any> {
    return from((async () => {
      const pdfFile = this.generatePDF(data);
      return await this.uploadToPinata(pdfFile);
    })());
  }

  private async uploadToIPFS(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'pdf',
        uploadDate: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'pinata_api_key': this.PINATA_API_KEY,
            'pinata_secret_api_key': this.PINATA_SECRET_KEY,
            'Content-Type': `multipart/form-data;`
          }
        }
      );

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        gatewayURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async storeOnBlockchain(ipfsHash: string, name: string): Promise<any> {
    try {
      /*const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        this.contractAddress,
        this.contractABI,
        signer
      );

      // Store PDF hash on blockchain
      const tx = await contract['storePDF'](ipfsHash, name);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };*/
    } catch (error) {
      throw new Error('Failed to store on blockchain: ' + error.message);
    }
  }

  async uploadAndStore(file: File, name: string) {
    try {
      // 1. Connect wallet
      // await this.connectWallet();

      // 2. Upload to IPFS via Pinata
      const ipfsHash = await this.uploadToPinata(file);

      // 3. Store on blockchain
      const receipt = await this.storeOnBlockchain(ipfsHash, name);

      return {
        success: true,
        ipfsHash: ipfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /*async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet: ' + error.message);
    }
  }*/
}
