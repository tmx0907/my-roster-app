// NavCard.tsx
import React from 'react';

interface NavCardProps {
  title: string;
  description: string;
  colorClass: string;
  // icon?: any; // 아이콘을 쓰지 않는다면 제거
}

// NavCard.tsx 내부
const NavCard: React.FC<{ title: string; description: string; colorClass: string }> = ({ title, description, colorClass }) => (
  <div className={`${colorClass} rounded-2xl p-6 shadow-md`}>
    …
  </div>
);

export default NavCard;
