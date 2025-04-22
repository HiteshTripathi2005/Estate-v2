import React from "react";
import { MdHome } from "react-icons/md";

const UserProperties = ({ userProperties, loadingProperties }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">User Properties</h3>
      {loadingProperties ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : userProperties.length === 0 ? (
        <p className="text-gray-500">
          This user has not listed any properties yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listed On
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {property.images && property.images.length > 0 ? (
                          <img
                            className="h-8 w-8 rounded-md object-cover"
                            src={property.images[0]}
                            alt=""
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                            <MdHome className="text-blue-500" size={16} />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {property.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.location?.city}, {property.location?.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ₹{property.price?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === "available"
                          ? "bg-green-100 text-green-800"
                          : property.status === "sold"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {property.status?.charAt(0).toUpperCase() +
                        property.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`/properties?id=${property._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProperties;
