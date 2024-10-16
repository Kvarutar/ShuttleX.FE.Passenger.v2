import axios from 'axios';

type handleMonoPaymentProps = {
  amount: number;
  setPaymentUrl: React.Dispatch<React.SetStateAction<string | null>>;
};
//Mono payment
export const handleMonoPayment = async ({ amount, setPaymentUrl }: handleMonoPaymentProps) => {
  try {
    //TODO Just for test. Change for real url and data
    const response = await axios.post('/create-payment', {
      amount: amount,
      currency: 'UAH', //need it?
    });

    const paymentUrl = response.data.url; // URL for redirecting
    setPaymentUrl(paymentUrl);
  } catch (error) {
    console.error('Error creating payment:', error);
  }
};

//Binance payment
export const handleBinancePayment = async ({ amount, setPaymentUrl }: handleMonoPaymentProps) => {
  try {
    //TODO Just for test. Change for real url and data
    const response = await axios.post('/create-payment', {
      amount: amount,
      currency: 'UAH', //need it?
    });

    const paymentUrl = response.data.url; // URL for redirecting
    setPaymentUrl(paymentUrl);
  } catch (error) {
    console.error('Error creating payment:', error);
  }
};

//checking payment status
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await axios.get(`/payment-status/${paymentId}`);
    return response.data.status; // 'success' or 'failed'
  } catch (error) {
    console.error('Error fetching payment status:', error);
  }
};
