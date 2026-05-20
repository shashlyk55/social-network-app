import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Share2, Link as LinkIcon, Send } from "lucide-react";
import { toast } from "sonner";

interface ShareMenuProps {
  postId: number;
}

export function PostShareMenu({ postId }: ShareMenuProps) {
  const handleCopyLink = async (e: Event) => {
    // В Radix e — это оригинальное событие
    const url = `${window.location.origin}/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors mr-auto"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      {/* Portal выносит меню за пределы PostItem, обрезание больше не грозит */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="w-56 bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl z-[100] py-2 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Item
            onSelect={handleCopyLink}
            className="px-4 py-3 text-sm font-medium hover:bg-[#252525] outline-none cursor-pointer flex items-center gap-3 text-slate-300"
          >
            <LinkIcon className="w-4 h-4" />
            Copy link
          </DropdownMenu.Item>

          <DropdownMenu.Item
            disabled
            className="px-4 py-3 text-sm font-medium opacity-50 flex items-center gap-3 text-slate-300 outline-none"
          >
            <Send className="w-4 h-4" />
            Send to...
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
