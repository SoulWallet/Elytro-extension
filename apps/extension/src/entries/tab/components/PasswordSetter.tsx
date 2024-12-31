import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/utils/shadcn/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { useState } from 'react';
import PasswordInput from '@/components/PasswordInputer';

const passwordForm = z
  .object({
    password: z
      .string()
      .min(6, {
        message: 'The password should be more than 6 characters.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'The password should include more than 1 capitalized letter.',
      })
      .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
        message: 'The password should include at least 1 special character.',
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
}

export function PasswordSetter({ onSubmit, loading }: PasswordSetterProps) {
  const form = useForm<z.infer<typeof passwordForm>>({
    resolver: zodResolver(passwordForm),
    mode: 'onChange',
  });
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const handleSubmit = async (data: z.infer<typeof passwordForm>) => {
    onSubmit(data.password);
  };

  const currentPassword = form.watch('password') || '';

  // 密码校验状态
  const pwdValidationStates = {
    length: currentPassword.length >= 6,
    uppercase: /[A-Z]/.test(currentPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(currentPassword),
  };

  // 确认密码校验
  const confirmValidationStates = {
    match: currentPassword === form.getValues('confirm'),
  };



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[416px] space-y-3xl"
      >
        <div className="space-y-sm">
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

                {
                  // form.formState.errors.password ? (
                  //   <FormMessage />
                  // ) : (
                  //   <FormDescription>
                  //     The password should be more than 6 characters and include
                  //     more than 1 capitalized letter.
                  //   </FormDescription>
                  // )
                }

                <div className="space-y-2 mt-2">
                  <div className={cn(
                    "text-sm transition-colors ",
                    pwdValidationStates.length ? "text-green" : "text-gray "
                  )}>
                    • More than 6 characters
                  </div>
                  <div className={cn(
                    "text-sm transition-colors",
                    pwdValidationStates.uppercase ? "text-green" : "text-gray "
                  )}>
                    • Include at least 1 uppercase letter
                  </div>
                  <div className={cn(
                    "text-sm transition-colors",
                    pwdValidationStates.special ? "text-green" : "text-gray "
                  )}>
                    • Include a special character
                  </div>
                </div>
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

                    {/* <FormMessage /> */}

                    <div className="space-y-2 mt-2">
                      <div className={cn(
                        "text-sm transition-colors ",
                        confirmValidationStates.match ? "text-green" : "text-gray "
                      )}>
                        • Passwords don&apos;t match
                      </div>

                    </div>
                  </FormItem>
                )}
              />
            )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-full h-14"
          disabled={loading}
          size="large"
        >
          {loading ? 'Creating...' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
}
