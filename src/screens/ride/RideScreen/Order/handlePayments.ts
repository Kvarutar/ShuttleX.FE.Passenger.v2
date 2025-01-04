import axios from 'axios';

import { logger } from '../../../../App';

type handleMonoPaymentProps = {
  amount: number;
  currencyCode: string;
  setPaymentUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

//Mono payment
export const handleMonoPayment = async ({ amount, currencyCode, setPaymentUrl }: handleMonoPaymentProps) => {
  try {
    //TODO Just for test. Change for real url and data
    const response = await axios.post('/create-payment', {
      amount: amount,
      currency: currencyCode,
    });

    const paymentUrl = response.data.url; // URL for redirecting
    setPaymentUrl(paymentUrl);
  } catch (error) {
    logger.error('Error creating payment:', error);
  }
};

//Binance payment
export const handleBinancePayment = async ({ amount, currencyCode, setPaymentUrl }: handleMonoPaymentProps) => {
  try {
    //TODO Just for test. Change for real url and data
    const response = await axios.post('/create-payment', {
      amount: amount,
      currency: currencyCode,
    });

    const paymentUrl = response.data.url; // URL for redirecting
    setPaymentUrl(paymentUrl);
  } catch (error) {
    logger.error('Error creating payment:', error);
  }
};

//checking payment status
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await axios.get(`/payment-status/${paymentId}`);
    return response.data.status; // 'success' or 'failed'
  } catch (error) {
    logger.error('Error fetching payment status:', error);
  }
};
