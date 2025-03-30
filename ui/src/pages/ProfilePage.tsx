import { useProfile } from "../hooks/queries";

export const ProfilePage = () => {
  const { data, isPending, isError } = useProfile();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Ops something went wrong...</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default ProfilePage;
