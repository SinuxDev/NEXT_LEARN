"use client";

import { VariantsWithImagesTags } from "@/types/infer-types";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

type ProductTypesProps = {
  variants: VariantsWithImagesTags[];
};

export default function ProductTypes({ variants }: ProductTypesProps) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;

  return variants
    .filter((variant) =>
      selectedType ? variant.productType === selectedType : true
    )
    .map((variant) => (
      <motion.div
        key={variant.id}
        animate={{ y: 0, opacity: 1 }}
        initial={{ opacity: 0, y: 4 }}
        className="text-secondary-foreground  font-medium"
      >
        {selectedType}
      </motion.div>
    ));
}
