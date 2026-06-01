import Link from "next/link";

function LoginMessage() {
  return (
    <div className="grid bg-primary-800 ">
      <p className="text-center text-xl py-12 self-center">
        <Link href="/login" className="text-accent-400 underline">
          Sign in
        </Link>{" "}
        to reserve this room right now
      </p>
    </div>
  );
}

export default LoginMessage;
