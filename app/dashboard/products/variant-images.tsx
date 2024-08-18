"use client";

import { VariantSchema } from "@/types/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UploadDropzone } from "@/app/api/uploadthing/uploadthing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Reorder } from "framer-motion";
import { useState } from "react";

export default function VariantImages() {
  const [active, setActive] = useState(0);

  const { getValues, control, setError } =
    useFormContext<z.infer<typeof VariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });
  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({}) => (
          <FormItem>
            <FormLabel>Variant Tags</FormLabel>
            <FormControl>
              <UploadDropzone
                className="ut-allowed-content:text-secondary-foreground ut-label:text-primary 
             ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out
             border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                onUploadError={(error) => {
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={(files) => {
                  files.map((file) =>
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    })
                  );
                  return files;
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues("variantImages");
                  images.map((image, imgIDX) => {
                    if (image.url.search("blob:") === 0) {
                      const img = files.find(
                        (file) => file.name === image.name
                      );

                      if (img) {
                        update(imgIDX, {
                          ...image,
                          url: img.url,
                          name: img.name,
                          size: img.size,
                          key: img.key,
                        });
                      }
                    }
                  });
                  return;
                }}
                config={{ mode: "auto" }}
                endpoint="variantUploader"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orders</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];
              e.map((item, index) => {
                if (item === activeElement) {
                  move(active, index);
                  setActive(index);
                  return;
                }
                return;
              });
            }}
          >
            {fields.map((field, index) => {
              return (
                <Reorder.Item
                  as="tr"
                  key={field.id}
                  id={field.id}
                  onDragStart={() => setActive(index)}
                  value={field}
                  className={cn(
                    field.url.search("blob:") === 0
                      ? "animate-pulse transition-all"
                      : "",
                    "text-sm font-bold text-muted-foreground hover:text-primary"
                  )}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell> {field.name} </TableCell>
                  <TableCell>
                    {(field.size / (1024 * 1024)).toFixed(2) + " MB"}
                  </TableCell>
                  <TableCell>
                    <div className="flex  items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        priority
                        width={72}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                      variant={"ghost"}
                      className="scale-75"
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}
