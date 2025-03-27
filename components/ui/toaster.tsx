"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider data-oid="7_qq7st">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} data-oid="n2mlda4">
            <div className="grid gap-1" data-oid="kqrrtyx">
              {title && <ToastTitle data-oid="ixwo5tb">{title}</ToastTitle>}
              {description && (
                <ToastDescription data-oid="zya1qpd">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose data-oid="ja-804g" />
          </Toast>
        );
      })}
      <ToastViewport data-oid="t-ri8q5" />
    </ToastProvider>
  );
}
