import { Injectable } from '@nestjs/common';

@Injectable()
export class ForexService {
    async getFxRate(fromCurrency: string, toCurrency: string) {
        if (fromCurrency === 'USD' && toCurrency === 'INR') {
            return 75;
        }
    }
}
