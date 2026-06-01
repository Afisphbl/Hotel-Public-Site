import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";

export const metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) redirect("/login");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  let backendGuest = null;
  try {
    const res = await fetch(`${BACKEND_URL}/public/auth/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
    });
    if (res.ok) backendGuest = await res.json();
  } catch {}

  const guest = {
    fullName: backendGuest
      ? `${backendGuest.firstName || ""} ${backendGuest.lastName || ""}`.trim()
      : session.user.fullName,
    email: backendGuest?.email || session.user.email,
    nationality: backendGuest?.nationality || "",
    nationalID: backendGuest?.nationalID || "",
    countryFlag: backendGuest?.countryFlag || "",
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm guest={guest} accessToken={session.accessToken}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
}
