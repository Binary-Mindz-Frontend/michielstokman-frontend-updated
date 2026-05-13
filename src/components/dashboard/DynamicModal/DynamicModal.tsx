'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

/**
 * @component DynamicModal
 * @description Fixed accessibility error where DialogTitle was missing when no title was provided.
 */

interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`border-mute/20 max-w-137.5 gap-0 p-4 ${className}`}>
        {!title && (
          <>
            <DialogTitle>Modal Dialog</DialogTitle>
          </>
        )}

        {/* Visible Header Section */}
        {(title || description) && (
          <div className="mb-6 flex flex-col space-y-1">
            {title && <DialogTitle className="section-title mb-0">{title}</DialogTitle>}

            {description && (
              <DialogDescription className="text-mute text-sm leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="w-full">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicModal;
