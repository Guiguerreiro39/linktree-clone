"use client";

import { basicInformationSchema } from "@/app/(protected)/admin/schemas";
import { InputAvatar } from "@/components/input-avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

type Props = {
  page: inferRouterOutputs<AppRouter>["page"]["get"];
};

export const BasicInfoSection = ({ page }: Props) => {
  const form = useForm<z.infer<typeof basicInformationSchema>>({
    mode: "onChange",
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      tag: page.tag,
      bio: page.bio ?? "",
      imageUrl: page.imageUrl ?? "",
    },
  });

  const utils = api.useUtils();

  const { mutate, isPending } = api.page.update.useMutation({
    onSuccess: async () => {
      toast.success("Basic information updated successfully");
      form.reset(form.watch(), { keepValues: true, keepDirty: false });
      await utils.page.get.invalidate();
    },
    onError: () => {
      toast.error("Failed to update basic information");
    },
  });

  const onSubmit = async (values: z.infer<typeof basicInformationSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-8 items-center justify-between">
          <h1 className="text-xl font-bold">Basic Information</h1>
          {form.formState.isDirty && (
            <Button
              isLoading={isPending}
              variant="outline"
              type="submit"
              size="sm"
            >
              Save
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between gap-2">
                <FormLabel>Image</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <InputAvatar onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormDescription>
                This is the image that will be displayed on your page.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between gap-2">
                <FormLabel>Tag</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="rootlink"
                    className="peer ps-6 pe-12"
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                    @
                  </span>
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                    .rootlink.com
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                This is your public display tag.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between gap-2">
                <FormLabel>Bio</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea
                  placeholder="Write something about your page..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the bio that will be displayed on your page.
              </FormDescription>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
