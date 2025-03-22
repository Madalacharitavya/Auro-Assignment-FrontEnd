
import React from 'react';
import { User } from '../store/chatStore';

type UserAvatarProps = {
  user: Partial<User>;
  size?: 'sm' | 'md' | 'lg';
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`avatar relative ${sizeClasses[size]}`}>
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <span>{user.name ? getInitials(user.name) : '?'}</span>
      )}
      {user.status && (
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background
            ${user.status === 'online' ? 'bg-green-500' : 
              user.status === 'typing' ? 'bg-yellow-500' : 'bg-gray-400'}`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
