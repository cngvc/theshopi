'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, $current] = useState(0);

  return (
    <div className="space-y-3">
      <Image src={images[current]} alt="Product Image" width={448} height={448} className="object-cover aspect-square w-full" />
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => $current(index)}
            className={cn('border col-span-1 cursor-pointer hover:border-orange-600', current === index && 'border-orange-500')}
          >
            <Image src={image} alt="Product Image" width={106} height={106} className="object-center object-cover aspect-square w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
