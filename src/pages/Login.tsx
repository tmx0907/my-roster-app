import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log("로그인 요청", data);
    // TODO: 로그인 API 호출
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <div>
          <label htmlFor="email" className="block mb-1">이메일</label>
          <input id="email" type="email" {...register("email")} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">비밀번호</label>
          <input id="password" type="password" {...register("password")} className="w-full p-2 border rounded" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">로그인</button>
      </form>
    </div>
  );
}

export default Login;
