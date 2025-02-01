import { startTransition } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

import { useCreateOrder } from "@/service/order";
// import { useDeleteAllCart } from "@/service/cart";

import { defaultValues, checkoutSchema } from "./data/schema";

type CheckoutFormDialogPropsType = {
  checkoutOpen: boolean;
  handleOpenChange: () => void;
};

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutFormDialog(props: CheckoutFormDialogPropsType) {
  const { checkoutOpen, handleOpenChange } = props;

  const { toast } = useToast();
  const { trigger: triggerCreate } = useCreateOrder();
  //   const { trigger: triggerDeleteAllCart } = useDeleteAllCart();

  const returnMethods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    values: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = returnMethods;

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const payload = {
        data: {
          ...data,
        },
      };
      await triggerCreate({ data: payload });
      toast({
        title: "訂單已送出",
        description: "感謝您的訂購！",
        variant: "default",
      });

      startTransition(async () => {
        // await triggerDeleteAllCart();
        await mutate((key?: [string, ...unknown[]]) => {
          if (key && Array.isArray(key)) {
            return key[0].includes("/cart");
          }
        });
        handleOpenChange();
      });
    } catch (error) {
      toast({
        title: "",
        description: error instanceof Error ? error.message : "發生錯誤",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={checkoutOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>結帳資訊</DialogTitle>
        </DialogHeader>
        <DialogDescription>請填寫您的聯絡資訊</DialogDescription>

        <FormProvider {...returnMethods}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Controller
                name="user.name"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Label htmlFor="name" className="text-sm font-medium">
                      姓名
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="請輸入姓名"
                        className="h-12"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                      />
                    </div>
                    {errors.user?.name && (
                      <Alert
                        variant="destructive"
                        className="text-red-800 bg-red-50 border-red-200"
                      >
                        <AlertDescription>
                          {errors.user.name.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="user.email"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="請輸入 Email"
                        className="h-12"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                      />
                    </div>
                    {errors.user?.email && (
                      <Alert
                        variant="destructive"
                        className="text-red-800 bg-red-50 border-red-200"
                      >
                        <AlertDescription>
                          {errors.user.email.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="user.tel"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Label htmlFor="tel" className="text-sm font-medium">
                      電話
                    </Label>
                    <div className="relative">
                      <Input
                        id="tel"
                        type="tel"
                        placeholder="請輸入電話"
                        className="h-12"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                      />
                    </div>
                    {errors.user?.tel && (
                      <Alert
                        variant="destructive"
                        className="text-red-800 bg-red-50 border-red-200"
                      >
                        <AlertDescription>
                          {errors.user.tel.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="user.address"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Label htmlFor="address" className="text-sm font-medium">
                      收件人地址
                    </Label>
                    <div className="relative">
                      <Input
                        id="address"
                        type="text"
                        placeholder="請輸入地址"
                        className="h-12"
                        value={value}
                        onChange={onChange}
                        ref={ref}
                      />
                    </div>
                    {errors.user?.address && (
                      <Alert
                        variant="destructive"
                        className="text-red-800 bg-red-50 border-red-200"
                      >
                        <AlertDescription>
                          {errors.user.address.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="message"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Label htmlFor="message" className="text-sm font-medium">
                      訂單備註
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="有什麼想告訴我們的..."
                      className="min-h-[120px]"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                    />
                    {errors.message && (
                      <Alert
                        variant="destructive"
                        className="text-red-800 bg-red-50 border-red-200"
                      >
                        <AlertDescription>
                          {errors.message.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? "送出中..." : "送出訂單"}
              </Button>
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
