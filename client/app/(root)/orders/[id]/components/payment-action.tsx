import { Button } from '@/components/ui/button';
import { IPayment } from '@cngvc/shopi-types';

const MarkAsPaidButton = () => {
  return (
    <Button type="button" className="block w-full" onClick={() => {}}>
      Mark As Paid
    </Button>
  );
};

const MarkAsDeliveredButton = () => {
  return (
    <Button type="button" className="block w-full" onClick={() => {}}>
      Mark As Delivered
    </Button>
  );
};

const PaymentAction = ({ isPaid, isDelivered, payment }: { isPaid: boolean; isDelivered: boolean; payment: IPayment }) => {
  return (
    <div>
      {/* Cash On Delivery */}
      {!isPaid && payment.method === 'cod' && <MarkAsPaidButton />}
      {isPaid && !isDelivered && <MarkAsDeliveredButton />}
    </div>
  );
};

export default PaymentAction;
