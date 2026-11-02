import { Droplets, Scissors, ShoppingCart, Sparkles, Star } from "lucide-react";
import type { NotificationKind } from "../services/NotificationsService";

export default function NotificationIcon({ kind }: { kind: NotificationKind }) {
  const cls = "w-5 h-5";
  let icon;
  switch (kind) {
    case "order_accepted":
    case "order_rejected":
      icon = <ShoppingCart className={cls} aria-hidden="true" />;
      break;
    case "task_watering":
      icon = <Droplets className={cls} aria-hidden="true" />;
      break;
    case "task_pruning":
      icon = <Scissors className={cls} aria-hidden="true" />;
      break;
    case "task_fertilizing":
      icon = <Star className={cls} aria-hidden="true" />;
      break;
    default:
      icon = <Sparkles className={cls} aria-hidden="true" />;
  }
  return (
    <span className="w-10 h-10 rounded-full bg-[#dbe8df] text-[#3f5f4d] flex items-center justify-center flex-shrink-0">
      {icon}
    </span>
  );
}
