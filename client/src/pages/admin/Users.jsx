"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Trash2, Search, Shield, User } from "lucide-react";
import { usersAPI } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery("adminUsers", usersAPI.getUsers);

  const deleteUserMutation = useMutation(usersAPI.deleteUser, {
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries("adminUsers");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const updateUserMutation = useMutation(
    ({ userId, userData }) => usersAPI.updateUser(userId, userData),
    {
      onSuccess: () => {
        toast.success("User updated successfully!");
        queryClient.invalidateQueries("adminUsers");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update user");
      },
    }
  );

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserMutation.mutate({
      userId,
      userData: { role: newRole },
    });
  };

  const filteredUsers = users?.data?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 sm:mt-2">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile-friendly Cards (Visible on mobile/tablet, hidden on desktop) */}
      <div className="md:hidden space-y-4 mb-6">
        {filteredUsers?.map((user) => (
          <div key={user._id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-4 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-slate-900 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white break-words">{user.name}</h3>
                <p className="text-xs text-slate-400">ID: {user._id.slice(-8)}</p>
              </div>
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                    user.role === "admin"
                      ? "bg-purple-900 text-purple-200"
                      : "bg-blue-900 text-blue-200"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="h-3 w-3 mr-1" />
                  ) : (
                    <User className="h-3 w-3 mr-1" />
                  )}
                  {user.role}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 text-xs space-y-2">
              <div>
                <span className="text-slate-400 block mb-0.5">Email</span>
                <span className="text-white block break-all">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Joined</span>
                <span className="text-white block">{formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-700">
              {user.role !== "admin" ? (
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors flex items-center justify-center text-xs font-semibold w-full sm:w-auto"
                  disabled={deleteUserMutation.isLoading}
                  title="Delete User"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete User
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">No Actions</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Users Table (Visible on Desktop) */}
      <div className="hidden md:block bg-slate-800 rounded-lg shadow-sm border border-slate-700 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  USER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  ROLE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  JOINED
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filteredUsers?.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-slate-900 font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-900 text-purple-200"
                          : "bg-blue-900 text-blue-200"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <Shield className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded hover:bg-slate-700"
                          disabled={deleteUserMutation.isLoading}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No Actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers?.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">
            No users found matching your criteria.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-300">Total Users</h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mt-2">
            {users?.data?.length || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-300">Regular Users</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
            {users?.data?.filter((user) => user.role === "user").length || 0}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-300">Administrators</h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2">
            {users?.data?.filter((user) => user.role === "admin").length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
