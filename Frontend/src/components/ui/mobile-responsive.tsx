import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileResponsiveProps {
  children: React.ReactNode;
  mobileVariant?: React.ReactNode;
  className?: string;
  mobileClassName?: string;
}

export const MobileResponsive: React.FC<MobileResponsiveProps> = ({
  children,
  mobileVariant,
  className,
  mobileClassName
}) => {
  const isMobile = useIsMobile();

  if (isMobile && mobileVariant) {
    return (
      <div className={cn(mobileClassName, className)}>
        {mobileVariant}
      </div>
    );
  }

  return (
    <div className={cn(className, isMobile && mobileClassName)}>
      {children}
    </div>
  );
};

interface HiddenProps {
  children: React.ReactNode;
  on?: 'mobile' | 'desktop';
}

export const Hidden: React.FC<HiddenProps> = ({ children, on = 'mobile' }) => {
  const isMobile = useIsMobile();

  if ((on === 'mobile' && isMobile) || (on === 'desktop' && !isMobile)) {
    return null;
  }

  return <>{children}</>;
};

interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  mobileDirection?: 'row' | 'column';
  spacing?: string;
  mobileSpacing?: string;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'row',
  mobileDirection = 'column',
  spacing = 'gap-4',
  mobileSpacing = 'gap-2',
  className
}) => {
  const isMobile = useIsMobile();
  
  const currentDirection = isMobile ? mobileDirection : direction;
  const currentSpacing = isMobile ? mobileSpacing : spacing;
  
  const directionClass = currentDirection === 'row' ? 'flex-row' : 'flex-col';

  return (
    <div className={cn('flex', directionClass, currentSpacing, className)}>
      {children}
    </div>
  );
};

interface GridProps {
  children: React.ReactNode;
  cols?: number;
  mobileCols?: number;
  spacing?: string;
  mobileSpacing?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<GridProps> = ({
  children,
  cols = 4,
  mobileCols = 1,
  spacing = 'gap-6',
  mobileSpacing = 'gap-4',
  className
}) => {
  const isMobile = useIsMobile();
  
  const currentCols = isMobile ? mobileCols : cols;
  const currentSpacing = isMobile ? mobileSpacing : spacing;
  
  const gridClass = `grid-cols-${currentCols}`;

  return (
    <div className={cn('grid', gridClass, currentSpacing, className)}>
      {children}
    </div>
  );
};
