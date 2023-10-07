import React from 'react'

export const NotificationIcon = ({ unreadCount }: { unreadCount: number }) => {
  const [unreadCounts, setUnreadCounts] = React.useState(0)
  React.useEffect(() => {
    setUnreadCounts(unreadCount)
  }, [unreadCount])
  console.log(unreadCounts, 'unreadCount in icon')
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
    >
      <path
        className="fill-default-400"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0005 22C13.1005 22 14.0005 21.1 14.0005 20H10.0005C10.0005 21.1 10.8905 22 12.0005 22ZM18.0005 16V11C18.0005 7.93 16.3605 5.36 13.5005 4.68V4C13.5005 3.17 12.8305 2.5 12.0005 2.5C11.1705 2.5 10.5005 3.17 10.5005 4V4.68C7.63054 5.36 6.00054 7.92 6.00054 11V16L4.71054 17.29C4.08054 17.92 4.52054 19 5.41054 19H18.5805C19.4705 19 19.9205 17.92 19.2905 17.29L18.0005 16Z"
      />
      {unreadCount > 0 && (
        <g>
          <rect className="fill-danger" x="13" width="15" height="16" rx="7.5" />
          <text x="20.6" y="12.1" fill="white" fontSize="12" textAnchor="middle">
            {unreadCount}
          </text>
        </g>
      )}
    </svg>
  )
}
