import type { User } from '../types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const displayHobbies = user.hobbies.slice(0, 2);
  const remainingHobbies = user.hobbies.length - 2;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
      {/* Card Header with Avatar */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&size=48&background=random`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-gray-500">
              {user.nationality} • {user.age} years old
            </p>
          </div>
        </div>
      </div>

      {/* Card Content - Hobbies */}
      {user.hobbies.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {displayHobbies.map((hobby, index) => (
              <span
                key={`${user.id}-hobby-${index}`}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors"
              >
                {hobby}
              </span>
            ))}
            {remainingHobbies > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                +{remainingHobbies} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
