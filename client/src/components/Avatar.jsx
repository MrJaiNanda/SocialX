// Since this simple version doesn't support image uploads,
// every user is shown as a circle with their first initial,
// colored with the accent color assigned to them at signup.
export default function Avatar({ username, color, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
  };

  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 rounded-full flex items-center justify-center font-semibold text-white`}
      style={{ backgroundColor: color || "#2D5BFF" }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
