import Link from "next/link";

function LoginMessage() {
  return (
    <div className='grid h-full w-full bg-primary-800'>
      <p className='self-center py-12 text-center text-xl'>
        <Link href='/login' className='text-accent-400 underline'>
          Sign in
        </Link>{" "}
        to reserve this room right now
      </p>
    </div>
  );
}

export default LoginMessage;
