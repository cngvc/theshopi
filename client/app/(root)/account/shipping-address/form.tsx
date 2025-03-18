'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateBuyerShippingAddress } from '@/lib/hooks/use-update-address.hook';
import { IShippingAddress, shippingAddressSchema } from '@cngvc/shopi-types';
import { joiResolver } from '@hookform/resolvers/joi';
import { ArrowRight, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const ShippingAddressForm = ({ address }: { address?: IShippingAddress }) => {
  const router = useRouter();
  const { mutate: updateBuyerShippingAddress, isPending, error } = useUpdateBuyerShippingAddress();

  const form = useForm<IShippingAddress>({
    resolver: joiResolver(shippingAddressSchema),
    defaultValues: {
      address: address?.address || '',
      city: address?.city || '',
      country: address?.country || '',
      postalCode: address?.postalCode || ''
    }
  });

  const onSubmit: SubmitHandler<IShippingAddress> = async (values) => {
    updateBuyerShippingAddress(values, {
      onSuccess: () => {
        router.back();
      },
      onError: (err) => {
        console.error('Failed to update address:', err);
      }
    });
  };

  return (
    <>
      <div className="max-w-md space-y-4 w-full">
        <h2 className="text-md font-bold">Shipping Address</h2>
        <p className="text-sm text-muted-foreground">Please enter and address to ship to</p>

        {error && <p className="text-destructive">{(error as Error).message}</p>}
        {form.formState.errors.root && <p className="text-destructive">{form.formState.errors.root.message}</p>}

        <Form {...form}>
          <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {['address', 'city', 'country', 'postalCode'].map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as keyof IShippingAddress}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="capitalize">{field.name}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${field.name}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} aria-busy={isPending}>
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
