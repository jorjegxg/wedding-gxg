import Image from "next/image";

import { Great_Vibes } from 'next/font/google'
import GalleryWithUpload from "./gallery_with_upload";
import UploadPhotosButton from "./upload_photos_button";

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
})

export default function Home() {
  // return <GalleryWithUpload/>;


  return (
    <div className="w-screen h-screen flex-col justify-center items-center p-8">
      <div className={`text-6xl ${greatVibes.className} text-center`}>
        Gheorghe and Gabriela
      </div>
      
      <GalleryWithUpload/>
      <UploadPhotosButton/>
      
    </div>
  );
}
