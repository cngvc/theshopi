'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUpdateBuyerPayment } from '@/lib/hooks/use-update-payment.hook';
import { IPayment, PaymentMethod, paymentScheme } from '@cngvc/shopi-types';
import { joiResolver } from '@hookform/resolvers/joi';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const PaymentMethodForm = ({ payment }: { payment?: IPayment }) => {
  const router = useRouter();
  const { mutate: updateBuyerPayment, isPending } = useUpdateBuyerPayment();

  const form = useForm<IPayment>({
    resolver: joiResolver(paymentScheme),
    defaultValues: {
      method: payment?.method || PaymentMethod.cod
    }
  });

  const onSubmit: SubmitHandler<IPayment> = async (values) => {
    updateBuyerPayment(values, {
      onSuccess: () => {
        router.back();
      },
      onError: (err) => {
        console.error('Failed to update payment:', err);
      }
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4 w-full">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">Please select a payment method</p>
        <Form {...form}>
          <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-2">
                        {Object.values(PaymentMethod).map((paymentMethod) => (
                          <FormItem key={paymentMethod} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={paymentMethod} checked={field.value === paymentMethod} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">{paymentMethod}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
