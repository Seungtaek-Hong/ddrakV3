import dynamic from 'next/dynamic'
const ManageUsersPageComponent = dynamic(
  () => import('@root/src/client/components/pages/account/ManageUsersPageComponent'),
  { ssr: false },
)

export default function ManageUsers() {
  return <ManageUsersPageComponent />
}