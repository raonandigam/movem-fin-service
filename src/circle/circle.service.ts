import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class CircleService {

  constructor(
    private readonly transactionService: TransactionsService,
  ) {}

  CIRCLE_URL = 'https://api-sandbox.circle.com/v1';

  MOVEM_WALLET_ID = 1000662094;

  HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization:
      'Bearer QVBJX0tFWToyYmYyZjdmMjU2MzFhOTdkNzVjMzA5MTJjZmRkN2I4MzpiODgzNmJjY2ZkNzJjNjM0M2ZmNjlmMjc0N2U4YmJhOA==',
  };

  async addWallet() {
    const WALLET_URL = this.CIRCLE_URL + '/wallets';

    const response = await axios.post(
      WALLET_URL,
      {
        idempotencyKey: uuidv4(),
      },
      { headers: this.HEADERS },
    );

    return response.data;
  }

  private async getWallet(walletId: number) {
    const WALLET_URL = this.CIRCLE_URL + '/wallets';

    const response = await axios.get(WALLET_URL + '/' + walletId, {
      headers: this.HEADERS,
    });

    return response.data.data;
  }

  async getWalletBalance(walletId: number) {
    const wallet = await this.getWallet(walletId);
    const balances: any[] = wallet.balances;
    const balance = balances.find((balance) => balance.currency === 'USD');
    return balance ?? { "amount": 0 };
  }

  async buyUSDC(userId: string, amount: number, dstWallet: number) {
    const PAYMENTS_URL = this.CIRCLE_URL + '/payments';

    const payload = {
      idempotencyKey: uuidv4(),
      amount: { amount: amount, currency: 'USD' },
      verification: 'cvv',
      source: { id: '6a71de2b-7b15-4269-ab1a-3563fe2981db', type: 'card' },
      description: 'User purchase',
      channel: '',
      metadata: {
        phoneNumber: '+12025550180',
        email: 'customer-0001@circle.com',
        sessionId: 'xxx1',
        ipAddress: '172.33.222.1',
      },
      encryptedData:
        'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2ZqcyttODRYZml4N0hVT24vcFBJNmdwVVpWRWh2d2liS0QyRVl0d1YKdzRsS1c3ZWRLV0lwdHFXTmcrUGlFSFV1VytiUytwS2FZZy9vZThkaFA3WTN1b1ZHZVFmMFBQVC9nbGQrClNZa2Z6RjZpMFIrVWZjdUI2OWJIVDRoK3BnN3llcHN0VWd1aGZuWitBalZPQnNuaFlRdVl2T0lBN2FSUgo3U0pyUXU4U3l5OUNDUkZIVU5CWUVYTEVNQzl5d1ZiTUl4QzV3WmhlbXB3OE9VNkhTeThhbWgzZFhsbzcKWjV1OE5VbSs0bmFRREtQbGJJZmgxRlpaMDF6TEM1bnhlLzdjamZDbG1hSTQwcEg0UUdQTDZickQ0T1NICnZza1B5dHZMOEJPNmxsUGdVN09Ud1FXMExsLzl5UjNZK1Qxa001cjZZV1N1REZSWnRoWWtza051YmJqbQplTkkrQVpsRm9Zdml3YW01Mkp2anNOUWgxWTRlMVNzbHFWMGVDdjNqOUpGb25SRFFBWXUybStodm9ib2kKMGtaQ3BzNUVjYnRGLzhGQWd6YXlkeU1iTGpFPQo9L1hJbgotLS0tLUVORCBQR1AgTUVTU0FHRS0tLS0tCg==',
      keyId: 'key1',
    };

    const response = await axios.post(PAYMENTS_URL, payload, {
      headers: this.HEADERS,
    });
    const payment = response.data.data;
    const transactionId = await this.transactionService.createTransaction({user: userId, transactionId: payment.id, type: 'Circle', description: 'Buy USDC', amount: amount, currency: 'USD', status: 'Pending'})
    this.pollPaymentAndTransfer(transactionId, payment.id, dstWallet);
    return payment;
  }

  async getPayment(paymentId: string) {
    const PAYMENTS_URL = this.CIRCLE_URL + '/payments';

    const response = await axios.get(PAYMENTS_URL + '/' + paymentId, {
      headers: this.HEADERS,
    });

    return response.data.data;
  }

  async transferUSDC(srcWallet: number, dstWallet: number, amount: number) {
    const TRANSFERS_URL = this.CIRCLE_URL + '/transfers';

    const payload = {
      source: {
        type: 'wallet',
        id: srcWallet,
      },
      destination: {
        type: 'wallet',
        id: dstWallet,
      },
      amount: {
        amount: amount,
        currency: 'USD',
      },
      idempotencyKey: uuidv4(),
    };
    console.log(payload);

    const response = await axios.post(TRANSFERS_URL, payload, {
      headers: this.HEADERS,
    });
    return response.data;
  }

  async transferToBlockchain(
    srcWallet: number,
    dstAddress: string,
    amount: number,
  ) {
    const TRANSFERS_URL = this.CIRCLE_URL + '/transfers';

    const payload = {
      source: {
        type: 'wallet',
        id: srcWallet,
      },
      destination: {
        type: 'blockchain',
        id: dstAddress,
        chain: 'AVAX',
      },
      amount: {
        amount: amount,
        currency: 'USD',
      },
      idempotencyKey: uuidv4(),
    };
    console.log(payload);

    const response = await axios.post(TRANSFERS_URL, payload, {
      headers: this.HEADERS,
    });
    return response.data;
  }

  async pollPaymentAndTransfer(transactionId: string, paymentId: string, dstWallet: number) {
    console.log('polling payment', paymentId);
    const payment = await this.getPayment(paymentId);
    if (payment.status === 'pending' || payment.status === 'confirmed') {
      setTimeout(
        () => this.pollPaymentAndTransfer(transactionId, paymentId, dstWallet),
        10000,
      );
    } else if (payment.status === 'paid') {
      console.log('Paid');
      this.transactionService.changeTransactionStatus(transactionId, 'Complete')
      const amountToCredit =
        parseFloat(payment.amount.amount) - parseFloat(payment.fees.amount);
      const roundedAmount = Math.round(amountToCredit * 100) / 100;
      this.transferUSDC(this.MOVEM_WALLET_ID, dstWallet, roundedAmount);
    } else {
      console.log('Payment failed', payment.status);
    }
  }
}
