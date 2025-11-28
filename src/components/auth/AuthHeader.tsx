"use client";

import Image from "next/image";

export function AuthHeader() {
  return (
    <header className="flex justify-center py-6">
      <div className="flex items-center gap-3">
        <Image src="/icons/logo.png" alt="Irelis" width={150} height={40} />
      </div>
    </header>
  );
}

