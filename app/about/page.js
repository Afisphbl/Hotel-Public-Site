import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import { getHotel } from "../_lib/data-service";

export const metadata = {
  title: "About",
};

const FALLBACK_HEADING1 = "Welcome to LuxeHotel";
const FALLBACK_BODY1 =
  "Where luxury and comfort blend seamlessly. Located in prime destinations worldwide, LuxeHotel offers an unparalleled experience of refined hospitality. From breathtaking city views to serene coastal retreats, every stay is crafted to perfection.\n\nOur carefully curated selection of rooms and suites provides the perfect base for both business and leisure travelers. Immerse yourself in elegant surroundings, savor world-class cuisine, and let our dedicated staff anticipate your every need.\n\nThis is where memorable moments are made. It&apos;s a place to slow down, relax, and feel the joy of exceptional hospitality in a beautiful setting.";

const FALLBACK_HEADING2 = "Excellence in hospitality";
const FALLBACK_BODY2 =
  "LuxeHotel is built on a foundation of exceptional service and attention to detail. Every aspect of your stay is thoughtfully designed to exceed expectations, from the moment you step through our doors to the fond memories you take with you.\n\nWe believe that true luxury lies in the details. Our properties combine timeless elegance with modern amenities, creating spaces that are both sophisticated and inviting. Whether you are visiting for business or pleasure, our dedicated team ensures a seamless and memorable experience.";

export default async function Page() {
  const hotel = await getHotel();
  const about = hotel?.settings?.aboutContent;

  const heading1 = about?.heading1 || FALLBACK_HEADING1;
  const paragraphs1 = (about?.body1 || FALLBACK_BODY1).split('\n\n').filter(Boolean);
  const heading2 = about?.heading2 || FALLBACK_HEADING2;
  const paragraphs2 = (about?.body2 || FALLBACK_BODY2).split('\n\n').filter(Boolean);
  const image1Src = about?.image1 || image1;
  const image2Src = about?.image2 || '/about-2.jpg';

  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          {heading1}
        </h1>

        <div className="space-y-8">
          {paragraphs1.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        {typeof image1Src === 'string' && image1Src.startsWith('http') ? (
          <img src={image1Src} className="w-full h-auto object-cover rounded" alt="About" />
        ) : (
          <Image
            src={image1Src}
            alt="Luxurious hotel lobby"
            placeholder="blur"
            quality={80}
          />
        )}
      </div>

      <div className="relative aspect-square col-span-2">
        {typeof image2Src === 'string' && image2Src.startsWith('http') ? (
          <img src={image2Src} className="w-full h-full object-cover rounded" alt="About" />
        ) : (
          <Image
            src={image2Src}
            fill
            className="object-cover"
            alt="LuxeHotel staff"
          />
        )}
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          {heading2}
        </h1>

        <div className="space-y-8">
          {paragraphs2.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

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
