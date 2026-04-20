'use client';

/**
 * @component DynamicActionButton
 * @description A versatile button component designed for dashboard actions.
 * Supports standard actions, Next.js link navigation, and loading states.
 * * @usage_examples
 * // 1. Default usage (No icon by default)
 * <DynamicActionButton label="Save Changes" onClick={handleSave} />
 * * // 2. Enable Default Icon (Shows the Plus icon)
 * <DynamicActionButton label="Add User" showIcon={true} onClick={handleOpen} />
 * * // 3. Custom Icon usage
 * import { Mail } from 'lucide-react';
 * <DynamicActionButton label="Send Email" showIcon={true} icon={Mail} />
 * * // 4. Danger/Delete Style
 * <DynamicActionButton label="Delete Account" variant="danger" showIcon={true} icon={Trash2} />
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';

interface DynamicButtonProps {
  type?: 'submit' | 'button';
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'warning' | 'danger';
  disabled?: boolean;
  icon?: LucideIcon | null;
  showIcon?: boolean;
}

const DynamicActionButton = ({
  type = 'button',
  label,
  href,
  onClick,
  className,
  variant = 'default',
  disabled = false,
  icon: Icon = Plus,
  showIcon = false,
}: DynamicButtonProps) => {
  /**
   * Style mapping for different button variants
   */
  const variantStyles = {
    default: 'bg-primary text-white border-primary hover:bg-primary/90',
    outline: 'bg-transparent border-primary text-primary hover:bg-primary/10',
    secondary: 'bg-[#334155] text-white border-transparent hover:bg-[#475569]',
    warning: 'bg-[#F0B10033] text-[#FDC700] border-[#854d0e]/50 hover:bg-[#F0B10060]/40',
    danger: 'bg-[#FB2C3633] text-error border-[#FB2C3633] hover:bg-[#FB2C3650]',
  };

  const combinedClasses = cn(
    'sm:h-11 w-fit cursor-pointer transition-all duration-500 border px-6 active:scale-95 flex items-center justify-center gap-2 font-medium',
    variantStyles[variant],
    className,
  );

  const buttonContent = (
    <>
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        /* Render icon only if showIcon is true and an Icon reference exists */
        showIcon && Icon && <Icon size={18} strokeWidth={2.5} />
      )}
      <span>{label}</span>
    </>
  );

  /**
   * Renders as a Next.js Link if an href is provided
   */
  if (href && !disabled) {
    return (
      <Button asChild className={combinedClasses}>
        <Link href={href} className="flex items-center gap-2">
          {buttonContent}
        </Link>
      </Button>
    );
  }

  /**
   * Standard button rendering
   */
  return (
    <Button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {buttonContent}
    </Button>
  );
};

export default DynamicActionButton;
