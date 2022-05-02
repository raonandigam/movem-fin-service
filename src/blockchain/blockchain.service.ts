import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

const newrl = require('newrl-js');

// Todo - store this securely
const custodianWallet = {
  address: '0xc29193dbab0fe018d878e258c93064f01210ec1a',
  public:
    'sB8/+o32Q7tRTjB2XcG65QS94XOj9nP+mI7S6RIHuXzKLRlbpnu95Zw0MxJ2VGacF4TY5rdrIB8VNweKzEqGzg==',
  private: 'xXqOItcwz9JnjCt3WmQpOSnpCYLMcxTKOvBZyj9IDIY=',
};

const NODE_ADDRESS = process.env.PEER_ADDRESS;
const node = new newrl.Node(NODE_ADDRESS);
@Injectable()
export class BlockchainService {
  async issueNUSD(newrlDestinationWallet: string, amount: number) {
    const tokenIssuanceUrl = `https://liylppn743.execute-api.ap-south-1.amazonaws.com/default/NewrlTokenAdd?token_code=NUSD&amount=${amount}&first_owner=${newrlDestinationWallet}`
    const response = await axios.get(tokenIssuanceUrl)
    if (response.status === 200) {
      return true;
    }
    return false;
  }

  async issueNINR(newrlDestinationWallet: string, inrAmount: number) {
    const tokenIssuanceUrl = `https://liylppn743.execute-api.ap-south-1.amazonaws.com/default/NewrlTokenAdd?token_code=NINR&amount=${inrAmount}&first_owner=${newrlDestinationWallet}` 
    const response = await axios.get(tokenIssuanceUrl)
    console.log(response.status, response.data)
    if (response.status === 200) {
      return true;
    }
    return false;
  }

  async bilateralTransferWithCustodian(wallet: { public: string; private: string; address: string; }, 
  fromToken: string, toToken: string, fromAmount: number, toAmount: number) {
    const addTransferRequest = {
      "transfer_type": 4,
      "asset1_code": fromToken,
      "asset2_code": toToken,
      "wallet1_address": wallet['address'],
      "wallet2_address": custodianWallet['address'],
      "asset1_qty": fromAmount,
      "asset2_qty": toAmount,
      "description": "Movem currency conversion",
      "additional_data": {}
    }

    const response = await axios.post(NODE_ADDRESS + '/add-transfer', addTransferRequest)

    let signedTransaction = await this.sign(response.data, wallet);
    signedTransaction = await this.sign(signedTransaction, custodianWallet);

    const _ = await this.validate(
      signedTransaction,
    );
  }

  async generateWalletAddress() {
    const wallet = await node.generateWalletAddress();
    return wallet;
  }

  async addWallet(wallet: any = undefined) {
    let newWallet: any;
    if (!wallet) {
      newWallet = this.generateWalletAddress();
    } else {
      newWallet = wallet;
    }

    const transaction = await node.addWallet(
      custodianWallet['address'],
      '910',
      newWallet['public'],
    );

    return {
      wallet,
      transaction,
    };
  }

  async sign(transaction: any, wallet_data=custodianWallet) {
    const request = {
      wallet_data: wallet_data,
      transaction_data: transaction,
    };
    const signedTransaction = await node.signTransaction(request);
    return signedTransaction;
  }

  async validate(transaction: any) {
    const request = transaction;
    const validationResult = await node.validateTransaction(request);
    return validationResult;
  }

  async getWalletTokenBalance(walletAddress: string, tokenCode: string) {
    const balance = await node.getBalance(
      'TOKEN_IN_WALLET',
      walletAddress,
      tokenCode,
    );
    return balance;
  }

  async getWalletBalance(walletAddress: string) {
    const wallet = await node.getBalance(
      'ALL_TOKENS_IN_WALLET',
      walletAddress,
      '',
    );
    return wallet;
  }
}
