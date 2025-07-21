import React from "react";
import { Check, X } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified: boolean;
}

export function VerifiedBadge({ isVerified }: VerifiedBadgeProps) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
        <Check size={12} className="text-emerald-600" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200">
      <X size={12} className="text-gray-500" />
      Unverified
    </span>
  );
}