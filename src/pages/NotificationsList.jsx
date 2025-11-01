// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchNotifications,
//   markAllNotificationsRead,
//   selectAllNotifications,
//   selectNotificationsLoading,
//   selectNotificationsError,
// } from "../store/slices/notificationSlice";

// import { Heart, MessageCircle, UserPlus } from "lucide-react";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const Notifications = () => {
//   const dispatch = useDispatch();
//   const notifications = useSelector(selectAllNotifications);
//   const loading = useSelector(selectNotificationsLoading);
//   const error = useSelector(selectNotificationsError);

//   useEffect(() => {
//     dispatch(fetchNotifications());
//   }, [dispatch]);

//   const handleMarkAllAsRead = () => {
//     dispatch(markAllNotificationsRead());
//   };

//   const getIcon = (type) => {
//     switch (type) {
//       case "like":
//         return <Heart size={18} color="red" />;
//       case "comment":
//         return <MessageCircle size={18} color="blue" />;
//       case "follow":
//         return <UserPlus size={18} color="green" />;
//       default:
//         return null;
//     }
//   };

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-blue-600">Notifications</h1>
//         {notifications.length > 0 && (
//           <button
//             onClick={handleMarkAllAsRead}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Mark all as read
//           </button>
//         )}
//       </div>

//       {loading && <p className="text-center text-blue-500">Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {notifications.length === 0 ? (
//         <div className="p-8 text-center border border-gray-200 rounded-lg">
//           <p className="text-gray-500">No notifications yet</p>
//         </div>
//       ) : (
//         notifications.map((n) => (
//           <div
//             key={n.id}
//             className={`flex gap-4 items-start p-4 mb-4 rounded-md border ${
//               n.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-300"
//             }`}
//           >
//             {/* Avatar */}
//             {/* <Avatar>
//               <AvatarImage src={n.sender_avatar || undefined} />
//               <AvatarFallback>
//                 {n.sender_name?.[0] || "?"}
//               </AvatarFallback>
//             </Avatar> */}

//             {/* Notification Body */}
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 {getIcon(n.type)}
//                 <p className="font-medium text-gray-800">{n.message}</p>
//               </div>

//               <div className="text-xs text-gray-500 mt-1">
//                 {formatDate(n.created_at)}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Notifications;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAllNotificationsRead,
  selectAllNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
} from "../store/slices/notificationSlice";

import { Heart, MessageCircle, UserPlus } from "lucide-react";

const NotificationsList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={18} color="red" />;
      case "comment":
        return <MessageCircle size={18} color="blue" />;
      case "follow":
        return <UserPlus size={18} color="green" />;
      default:
        return null;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading && <p className="text-blue-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {notifications.length <1 ? (
          <div className="p-8 text-center border border-gray-200 rounded-lg bg-white">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notif) => (
              <li key={notif.id}>
                <div
                  className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 w-full border-none  ${
                    notif.is_read ? "bg-white" : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <p className="flex items-center space-x-2">
                    {/* Dot Icon */}
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>

                    {/* Icon */}
                    {getIcon(notif.type)}

                    {/* Message */}
                    <span className="font-semibold">{notif.sender_name}</span>
                    <span>{notif.message.replace(notif.sender_name, "").trim()}</span>
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(notif.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default  NotificationsList;
