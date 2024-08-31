"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import React from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  const SubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMsg(submitError.message!);
      setIsLoading(false);
      return;
    }

    const result = await createPaymentIntent({
      amount: totalPrice,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });

    if (result?.data?.error) {
      setErrorMsg(result.data.error);
      setIsLoading(false);
      return;
    }

    if (result?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: result.data.success.clientSecretID!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: result.data.success.user as string,
        },
      });

      if (error) {
        setErrorMsg(error.message!);
        setIsLoading(false);
        return;
      } else {
        console.log("Payment Success");
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={SubmitHandler}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button disabled={!stripe || !elements}>
        <span>Pay Now</span>
      </Button>
    </form>
  );
}
