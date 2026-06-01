import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();

    const hotelId = cookies().get("hotel_id")?.value;
    if (!hotelId) {
      return NextResponse.json(
        { error: "No hotel context found. Please access via hotel subdomain." },
        { status: 400 },
      );
    }

    const [firstName, ...lastParts] = fullName.trim().split(" ");
    const lastName = lastParts.join(" ") || firstName;

    const res = await fetch(`${BACKEND_URL}/public/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, hotelId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
