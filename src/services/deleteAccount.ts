export const deleteAccount = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("https://chronos-backend-bqjf.onrender.com/api/settings/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Delete failed");
  }

  return data;
};
