interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

const borderColor = {
  success: "border-l-[#C8A456]",
  error: "border-l-red-500",
  info: "border-l-blue-400",
};

export default function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`border-l-4 ${borderColor[type]} bg-white px-4 py-3 rounded-md text-[#111111] text-sm shadow-lg min-w-[260px] animate-[fadeSlideIn_0.2s_ease]`}
    >
      {message}
    </div>
  );
}
