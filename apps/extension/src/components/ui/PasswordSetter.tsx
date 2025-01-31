import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import PasswordInput from '@/components/ui/PasswordInputer';
import { cn } from '@/utils/shadcn/utils';

const passwordForm = z
  .object({
    password: z
      .string()
      .min(6, {
        message: 'Must be more than 6 characters.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Must include more than 1 capitalized letter.',
      }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'], // path of error
  });

interface PasswordSetterProps {
  loading: boolean;
  onSubmit: (pwd: string) => void;
  className?: string;
}

export function PasswordSetter({
  className,
  onSubmit,
  loading,
}: PasswordSetterProps) {
  const form = useForm<z.infer<typeof passwordForm>>({
    resolver: zodResolver(passwordForm),
    mode: 'onChange',
  });
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const handleSubmit = async (data: z.infer<typeof passwordForm>) => {
    onSubmit(data.password);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-3xl ', className)}
      >
        <div className="flex flex-col w-full h-full justify-between">
          <div className="space-y-sm ">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      field={field}
                      disabled={loading}
                      placeholder="Enter password"
                      onPwdVisibleChange={setIsPwdVisible}
                    />
                  </FormControl>

                  {form.formState.errors.password ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Must be more than 6 characters with more than 1
                      capitalized letter.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {(loading ||
              (form.getValues('password')?.length > 0 &&
                form.formState.errors.password === undefined)) && (
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        disabled={loading}
                        placeholder="Repeat password"
                        showEye={false}
                        outerPwdVisible={isPwdVisible}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
