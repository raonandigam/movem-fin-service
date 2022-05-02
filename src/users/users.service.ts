import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CircleService } from 'src/circle/circle.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly blockchainService: BlockchainService,
    private readonly circleService: CircleService,
  ) {}

  async findById(id: string): Promise<User | undefined> {
    return await this.userModel.findById(id);
  }

  async getUserDetails(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      wallet_address: user.wallet_address,
      circle_wallet: user.circle_wallet
    };
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: email });
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async addWallet(userId: string) {
    const user = await this.findById(userId);

    if (user.wallet_address && user.wallet_address !== null) {
      throw new HttpException(
        'Wallet already mapped to user',
        HttpStatus.BAD_REQUEST,
      );
    }
    const wallet = await this.blockchainService.generateWalletAddress();
    const walletInfo = await this.blockchainService.addWallet(wallet);
    const signedTransaction = await this.blockchainService.sign(
      walletInfo.transaction,
    );
    const _ = await this.blockchainService.validate(signedTransaction);

    user.wallet_address = wallet['address'];
    user.privateKey = wallet['private'];
    user.publicKey = wallet['public'];

    const circle_wallet = await this.circleService.addWallet();
    user.circle_wallet = circle_wallet.data.walletId;

    user.save();

    return {...wallet, circle_wallet: circle_wallet.data.walletId};
  }

  async getWalletBalance(userId: string) {
    const user = await this.findById(userId);
    const wallet_balance = await this.blockchainService.getWalletBalance(
      user.wallet_address,
    );
    return wallet_balance;
  }
}
