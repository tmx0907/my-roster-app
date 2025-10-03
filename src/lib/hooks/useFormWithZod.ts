import { z } from "zod";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Zod 스키마를 전달하면 해당 스키마로 validation을 수행하는 useForm을 반환합니다.
 * 필요한 옵션은 React Hook Form의 UseFormProps로 전달하세요.
 */
export function useFormWithZod<
  Schema extends z.ZodType<any, any, any>
>(
  schema: Schema,
  options?: Omit<UseFormProps<z.infer<Schema>>, "resolver">,
) {
  return useForm<z.infer<Schema>>({
    resolver: zodResolver(schema),
    ...options,
  });
}
