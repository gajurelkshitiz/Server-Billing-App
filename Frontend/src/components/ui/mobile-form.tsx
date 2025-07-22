import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MobileFormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export const MobileForm: React.FC<MobileFormProps> = ({
  title,
  description,
  children,
  className,
  onSubmit
}) => {
  const isMobile = useIsMobile();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className={cn("space-y-1", isMobile && "pb-4")}>
        <CardTitle className={cn("text-lg", isMobile ? "text-base" : "text-xl")}>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(isMobile && "text-sm")}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(isMobile && "px-4 pb-4")}>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </CardContent>
    </Card>
  );
};

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required,
  description,
  error,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn("text-sm font-medium", isMobile && "text-xs")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {description && (
        <p className={cn("text-sm text-muted-foreground", isMobile && "text-xs")}>
          {description}
        </p>
      )}
      {error && (
        <p className={cn("text-sm text-red-600", isMobile && "text-xs")}>
          {error}
        </p>
      )}
    </div>
  );
};

interface FormGridProps {
  children: React.ReactNode;
  cols?: number;
  className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  cols = 2,
  className
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : `grid-cols-${cols}`,
      className
    )}>
      {children}
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex gap-2 pt-4",
      isMobile ? "flex-col" : "flex-row justify-end",
      className
    )}>
      {children}
    </div>
  );
};

// Enhanced components for better mobile experience
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn("text-sm font-medium", isMobile && "text-xs")}>
          {label}
        </Label>
      )}
      <Input
        className={cn(
          "w-full",
          isMobile && "h-12 text-base", // Larger on mobile for better usability
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className={cn("text-sm text-red-600", isMobile && "text-xs")}>
          {error}
        </p>
      )}
    </div>
  );
};

interface MobileSelectProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const MobileSelect: React.FC<MobileSelectProps> = ({
  label,
  error,
  children,
  value,
  onValueChange,
  placeholder,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn("text-sm font-medium", isMobile && "text-xs")}>
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(
          "w-full",
          isMobile && "h-12 text-base",
          error && "border-red-500"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
      {error && (
        <p className={cn("text-sm text-red-600", isMobile && "text-xs")}>
          {error}
        </p>
      )}
    </div>
  );
};

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn("text-sm font-medium", isMobile && "text-xs")}>
          {label}
        </Label>
      )}
      <Textarea
        className={cn(
          "w-full",
          isMobile && "min-h-24 text-base", // Larger on mobile
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className={cn("text-sm text-red-600", isMobile && "text-xs")}>
          {error}
        </p>
      )}
    </div>
  );
};
