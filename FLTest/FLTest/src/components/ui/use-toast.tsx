"use client";

import * as React from "react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast as useToastPrimitive } from "@/components/ui/toast-primitive";

const TOAST_LIMIT = 1;

export const useToast = () => {
  const { toasts, toast } = useToastPrimitive();

  return {
    toast,
    toasts: toasts.slice(-TOAST_LIMIT),
  };
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
