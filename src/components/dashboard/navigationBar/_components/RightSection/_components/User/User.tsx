'use client';
// import * as Avatar from '@radix-ui/react-avatar';

export default function UserAvatarDropdown() {
  // const userImgSrc = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

  return (
    <div className="flex items-center gap-6">
      {/* Notification Bell with Red Dot */}
      {/* <div className="border-primary/10 relative cursor-pointer rounded-full border p-2.5 transition-colors hover:bg-gray-50">
        <Bell size={22} className="text-secondary" />
        <span className="bg-error absolute top-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-white" />
      </div> */}

      <div className="hidden text-left lg:block">
        <h4 className="text-secondary text-lg leading-tight font-semibold">Michiel Stockman</h4>
        <p className="text-secondary text-sm opacity-90">Admin</p>
      </div>
    </div>
  );
}
