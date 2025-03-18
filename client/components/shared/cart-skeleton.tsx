import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CartSkeleton = () => {
  return (
    <>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {new Array(5).fill(null).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Skeleton className="h-12 w-12 rounded-none" />
                      <Skeleton className="h-6 w-2/3 rounded-none" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right justify-items-center">
                    <Skeleton className="h-6 w-20 rounded-none" />
                  </TableCell>
                  <TableCell className="text-right justify-items-end">
                    <Skeleton className="h-6 w-12 rounded-none" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default CartSkeleton;
