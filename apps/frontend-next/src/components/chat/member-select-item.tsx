import { ProfilePreview } from "@/types/profile";
import { Check } from "lucide-react";

interface MemberSelectItemProps {
  user: ProfilePreview;
  isSelected: boolean;
  onToggle: () => void;
  isAlreadyMember?: boolean;
}

export const MemberSelectItem = ({
  user,
  isSelected,
  onToggle,
  isAlreadyMember,
}: MemberSelectItemProps) => {
  return (
    <div
      onClick={!isAlreadyMember ? onToggle : undefined}
      className={`flex items-center justify-between py-2 px-2 rounded-xl transition-colors ${
        isAlreadyMember
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-white/5 group"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm uppercase">
          {user.displayName[0]}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user.displayName}
          </p>
          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        </div>
      </div>

      {!isAlreadyMember ? (
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            isSelected
              ? "bg-[#00b4ff] border-[#00b4ff] scale-110"
              : "border-gray-600 group-hover:border-gray-400"
          }`}
        >
          {isSelected && <Check size={12} className="text-black stroke-[3]" />}
        </div>
      ) : (
        <span className="text-[10px] font-bold uppercase text-gray-600 bg-gray-800/50 px-2 py-1 rounded">
          In Chat
        </span>
      )}
    </div>
  );
};
