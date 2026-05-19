'use client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import * as Avatar from '@radix-ui/react-avatar';
import { Bell, LogOut } from 'lucide-react';

export default function UserAvatarDropdown() {
  // const userImgSrc = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

  return (
    <div className="flex items-center gap-6">
      {/* Notification Bell with Red Dot */}
      <div className="border-primary/10 relative cursor-pointer rounded-full border p-2.5 transition-colors hover:bg-gray-50">
        <Bell size={22} className="text-dark-primary" />
        <span className="bg-error absolute top-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-white" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex cursor-pointer items-center gap-4 transition-all hover:opacity-90">
            {/* Profile Avatar */}
            {/* <Avatar.Root className="border-primary/10 h-12 w-12 overflow-hidden rounded-full border shadow-sm">
              <Avatar.Image
                src={userImgSrc}
                alt="Michiel Stockman"
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-[#FAF7F5] font-semibold text-[#3B261D]">
                MS
              </Avatar.Fallback>
            </Avatar.Root> */}

            {/* User Name & Role (Visible in Trigger) */}
            <div className="hidden text-left lg:block">
              <h4 className="text-dark-primary text-lg leading-tight font-semibold">
                Michiel Stockman
              </h4>
              <p className="text-secondary text-sm opacity-90">Admin</p>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-64 rounded-md border-none bg-white p-2 shadow-md ring-1 ring-black/5"
        >
          {/* User Info Section Inside Popover */}
          {/* <div className="flex items-center gap-3 rounded-md bg-[#FAF7F5] p-3">
            <Avatar.Root className="h-10 w-10 overflow-hidden rounded-full">
              <Avatar.Image src={userImgSrc} className="h-full w-full object-cover" />
              <Avatar.Fallback>MS</Avatar.Fallback>
            </Avatar.Root>
            <div className="overflow-hidden">
              <p className="text-dark-primary truncate text-sm font-semibold">Michiel Stockman</p>
              <p className="text-secondary truncate text-xs">michiel@example.com</p>
            </div>
          </div> */}

          {/* Actions */}
          <div className="mt-2 flex flex-col gap-1 border-t border-gray-100 pt-2">
            <Button
              variant="ghost"
              className="text-dark-primary w-full justify-start gap-2 rounded-sm text-sm font-medium hover:bg-[#FAF7F5]"
            >
              Profile Settings
            </Button>
            <Button
              variant="ghost"
              className="text-error/80 hover:text-error hover:bg-error/10 w-full justify-start gap-2 rounded-sm text-sm font-medium"
            >
              <LogOut size={16} />
              Log Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
