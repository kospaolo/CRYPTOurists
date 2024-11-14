import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { HttpHeaders } from '@angular/common/http';
import {Observable, from, map, catchError} from 'rxjs';
import axios from 'axios';
import { ethers } from 'ethers';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class PinataService {
  PINATA_API_KEY = 'PINATA_API_KEY';
  PINATA_SECRET_KEY = 'PINATA_SECRET_KEY';

  private contractAddress = 'YOUR_CONTRACT_ADDRESS'; // After deployment
  private contractABI = [
    "function storePDF(string memory _ipfsHash, string memory _name) public",
    "function getPDFCount() public view returns (uint256)",
    "function getPDF(uint256 _index) public view returns (string memory, uint256, string memory)"
  ];

  private baseURL = 'https://api.pinata.cloud';
  qrCodeUrl: string = 'https://cryptourist-nextjs.vercel.app/bookings/';
  pinataUrl: string = 'https://harlequin-abundant-jaguar-168.mypinata.cloud/ipfs/';

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

  getHTMLExample(link): string {
    const encodedText = encodeURIComponent(link);
    return `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodedText}&size=${100}x${100}" alt="QR Code">`;
  }

  generatePDF(data: any): Promise<File> {
    return new Promise((resolve, reject) => {
      // First generate QR code as data URL
      QRCode.toDataURL(this.qrCodeUrl + data.bookingId.toString(), {
        width: 100,
        margin: 0,
      })
        .then(qrDataUrl => {
          const doc = new jsPDF();
          let yPosition = 20;

          // Helper function to format values
          const formatValue = (value: any, key?: string): string => {
            // Handle BigInt values
            if (typeof value === 'bigint') {
              if (key === 'price' || key === 'totalAmount') {
                return `${String(Number(value.toString()) / 1e18)} CAM`;
              }
            }

            // if number is 0, return as string
            if (value === 0) {
              return '0';
            }

            // If it's not a number or undefined, return as string
            if (!value || typeof value !== 'number') {
              return String(value || '');
            }

            // Special cases for number types
            switch(key) {
              case 'bookingId':
                return String(value);
              case 'operatorFee':
                return `${String(value.toFixed(8))} CAM`;
              case 'totalAmount':
                return `${String(value)} CAM`;
              default:
                return String(value);
            }
          };

          // Add title
          doc.setFontSize(16);
          doc.text('Booking Details', 20, yPosition);

          // Add QR code directly from the data URL
          doc.addImage(qrDataUrl, 'PNG', 150, 20, 40, 40);

          yPosition += 70;

          // Create booking details table
          const bookingDetails = Object.entries(data)
            .filter(([key]) => key !== 'articles')
            .map(([key, value]) => [key, formatValue(value, key)]);

          autoTable(doc, {
            startY: yPosition,
            head: [['Property', 'Value']],
            body: bookingDetails,
            theme: 'striped',
            headStyles: {
              fillColor: [66, 66, 66],
              textColor: 255,
              fontStyle: 'bold'
            },
            styles: {
              fontSize: 10,
              cellPadding: 5
            }
          });

          yPosition = (doc as any).lastAutoTable.finalY + 20;

          // Add Articles header
          doc.setFontSize(16);
          doc.text('Articles', 20, yPosition);
          yPosition += 20;

          // Prepare articles data
          const articlesData = data.articles.map((article: any) => {
            return [
              article.articleName,
              article.businessAddress,
              formatValue(article.price, 'price'),
              article.activeStatus
            ];
          });

          // Create articles table
          autoTable(doc, {
            startY: yPosition,
            head: [['Article Name', 'Business Address', 'Price', 'Status']],
            body: articlesData,
            theme: 'striped',
            headStyles: {
              fillColor: [66, 66, 66],
              textColor: 255,
              fontStyle: 'bold'
            },
            styles: {
              fontSize: 10,
              cellPadding: 5
            },
            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: 80 },
              2: { cellWidth: 30 },
              3: { cellWidth: 30 }
            }
          });

          const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
          resolve(new File([pdfBlob], 'booking-details.pdf', { type: 'application/pdf' }));
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
          // If QR code fails, continue without it
          const doc = new jsPDF();
          // ... rest of PDF generation without QR code
          const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
          resolve(new File([pdfBlob], 'booking-details.pdf', { type: 'application/pdf' }));
        });
    });
  }

  async uploadToPinata(file) {
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
    return from(
      this.generatePDF(data)
        .then(pdfFile => this.uploadToPinata(pdfFile))
    ).pipe(
      map(result => ({
        ...result,
        bookingId: data.bookingId
      })),
      catchError(error => {
        return error;
      })
    );
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

  /*async storeOnBlockchain(ipfsHash: string, name: string): Promise<any> {
    try {
      /!*const provider = new ethers.BrowserProvider(window.ethereum);
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
      };*!/
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
  }*/

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
