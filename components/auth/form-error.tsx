import { AlertCircle } from "lucide-react";

export const FormErrorMsg = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className=" bg-destructive flex items-center gap-2 text-xs font-medium text-secondary-foreground p-3  mt-1">
      <AlertCircle className="w-4 h-4" />
      <p> {message} </p>
    </div>
  );
};
