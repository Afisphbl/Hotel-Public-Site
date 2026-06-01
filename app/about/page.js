import Image from "next/image";
import image1 from "@/public/about-1.jpg";

export const metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Welcome to LuxeHotel
        </h1>

        <div className="space-y-8">
          <p>
            Where luxury and comfort blend seamlessly. Located in prime
            destinations worldwide, LuxeHotel offers an unparalleled experience
            of refined hospitality. From breathtaking city views to serene
            coastal retreats, every stay is crafted to perfection.
          </p>
          <p>
            Our carefully curated selection of rooms and suites provides the
            perfect base for both business and leisure travelers. Immerse
            yourself in elegant surroundings, savor world-class cuisine, and
            let our dedicated staff anticipate your every need.
          </p>
          <p>
            This is where memorable moments are made. It&apos;s a place to
            slow down, relax, and feel the joy of exceptional hospitality in
            a beautiful setting.
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <Image
          src={image1}
          alt="Luxurious hotel lobby"
          placeholder="blur"
          quality={80}
        />
      </div>

      <div className="relative aspect-square col-span-2">
        <Image
          src="/about-2.jpg"
          fill
          className="object-cover"
          alt="LuxeHotel staff"
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Excellence in hospitality
        </h1>

        <div className="space-y-8">
          <p>
            LuxeHotel is built on a foundation of exceptional service and
            attention to detail. Every aspect of your stay is thoughtfully
            designed to exceed expectations, from the moment you step through
            our doors to the fond memories you take with you.
          </p>
          <p>
            We believe that true luxury lies in the details. Our properties
            combine timeless elegance with modern amenities, creating spaces
            that are both sophisticated and inviting. Whether you are visiting
            for business or pleasure, our dedicated team ensures a seamless
            and memorable experience.
          </p>

          <div>
            <a
              href="/cabins"
              className="inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
            >
              Explore our rooms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
